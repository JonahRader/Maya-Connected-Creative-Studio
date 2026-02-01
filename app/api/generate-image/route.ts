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

    // Use Flux Schnell (faster, included in free tier for testing)
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: prompt,
          aspect_ratio: '1:1',
          output_format: 'png',
          num_outputs: 1,
        },
      }
    );

    console.log('Replicate output:', JSON.stringify(output));

    // Handle different response formats
    let imageUrl: string | null = null;

    if (typeof output === 'string') {
      imageUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0];
    } else if (output && typeof output === 'object') {
      // Check for common response structures
      const obj = output as Record<string, unknown>;
      if (obj.url) imageUrl = obj.url as string;
      else if (obj.output) imageUrl = Array.isArray(obj.output) ? obj.output[0] : obj.output as string;
    }

    if (!imageUrl) {
      console.error('Unexpected output format:', output);
      throw new Error('Could not extract image URL from Replicate response');
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
