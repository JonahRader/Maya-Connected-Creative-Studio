import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { buildImagePrompt } from '@/lib/ai/prompts';

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

    // Build the prompt
    const prompt = buildImagePrompt({
      contentType,
      aesthetic,
      inspiration: inspiration?.analysis,
      revision,
      previousPrompt,
    });

    if (!process.env.REPLICATE_API_TOKEN) {
      console.warn('REPLICATE_API_TOKEN not configured, returning placeholder');
      return NextResponse.json({
        imageUrl: `https://placehold.co/1080x1080/369AC4/FFFFFF?text=${encodeURIComponent(contentType)}`,
        prompt,
        message: 'Using placeholder - configure REPLICATE_API_TOKEN for real generation',
      });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Create prediction and wait for it
    let prediction = await replicate.predictions.create({
      model: 'black-forest-labs/flux-schnell',
      input: {
        prompt: prompt,
        aspect_ratio: '1:1',
        output_format: 'webp',
        num_outputs: 1,
      },
    });

    console.log('Prediction created:', prediction.id, prediction.status);

    // Wait for the prediction to complete
    prediction = await replicate.predictions.wait(prediction);

    console.log('Prediction completed:', prediction.status, JSON.stringify(prediction.output));

    if (prediction.status === 'failed') {
      throw new Error(prediction.error || 'Prediction failed');
    }

    // Get the output URL
    let imageUrl: string | null = null;
    const output = prediction.output;

    if (typeof output === 'string') {
      imageUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      // Flux returns array of URLs
      imageUrl = typeof output[0] === 'string' ? output[0] : null;
    }

    if (!imageUrl) {
      console.error('No valid URL in output:', output);
      throw new Error('No image URL in prediction output');
    }

    return NextResponse.json({
      imageUrl,
      prompt,
    });
  } catch (error) {
    console.error('Image generation error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      imageUrl: 'https://placehold.co/1080x1080/369AC4/FFFFFF?text=Generation+Error',
      prompt: 'Error generating image',
      error: errorMessage,
    });
  }
}
