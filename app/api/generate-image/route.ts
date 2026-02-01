import { NextRequest, NextResponse } from 'next/server';
import { buildImagePrompt } from '@/lib/ai/prompts';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, aesthetic, inspiration, revision, previousPrompt } = body;

    if (!contentType || !aesthetic) {
      return NextResponse.json(
        { error: 'Missing required fields: contentType and aesthetic' },
        { status: 400 }
      );
    }

    const prompt = buildImagePrompt({
      contentType,
      aesthetic,
      inspiration: inspiration?.analysis,
      revision,
      previousPrompt,
    });

    const apiToken = process.env.REPLICATE_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json({
        imageUrl: `https://placehold.co/1080x1080/369AC4/FFFFFF?text=${encodeURIComponent(contentType)}`,
        prompt,
        message: 'Using placeholder - configure REPLICATE_API_TOKEN',
      });
    }

    // Create prediction
    const createResponse = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          aspect_ratio: '1:1',
          output_format: 'webp',
          num_outputs: 1,
        },
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Replicate API error:', createResponse.status, errorText);
      throw new Error(`Replicate API error: ${createResponse.status}`);
    }

    const prediction = await createResponse.json();
    console.log('Prediction response:', JSON.stringify(prediction));

    // If using Prefer: wait, the prediction should be complete
    // Otherwise we'd need to poll
    let output = prediction.output;

    // If not complete, poll for result
    if (prediction.status !== 'succeeded' && prediction.urls?.get) {
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pollResponse = await fetch(prediction.urls.get, {
          headers: { 'Authorization': `Bearer ${apiToken}` },
        });

        const pollResult = await pollResponse.json();
        console.log('Poll result:', pollResult.status);

        if (pollResult.status === 'succeeded') {
          output = pollResult.output;
          break;
        } else if (pollResult.status === 'failed') {
          throw new Error(pollResult.error || 'Generation failed');
        }

        attempts++;
      }
    }

    console.log('Final output:', JSON.stringify(output));

    // Extract URL from output
    let imageUrl: string | null = null;

    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    }

    if (!imageUrl) {
      throw new Error('No image URL in output');
    }

    return NextResponse.json({ imageUrl, prompt });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({
      imageUrl: 'https://placehold.co/1080x1080/369AC4/FFFFFF?text=Error',
      prompt: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
