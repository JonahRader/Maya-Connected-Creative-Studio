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

    // Use Flux Pro for high quality image generation
    const output = await replicate.run(
      'black-forest-labs/flux-1.1-pro',
      {
        input: {
          prompt: prompt,
          aspect_ratio: '1:1',
          output_format: 'png',
          output_quality: 90,
          safety_tolerance: 2,
          prompt_upsampling: true,
        },
      }
    );

    // Flux returns a URL string directly
    const imageUrl = typeof output === 'string' ? output : (output as string[])[0];

    if (!imageUrl) {
      throw new Error('No image URL returned from Replicate');
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
