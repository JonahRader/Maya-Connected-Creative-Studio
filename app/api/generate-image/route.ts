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

    // Use replicate.run which handles waiting automatically
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: prompt,
          aspect_ratio: '1:1',
          output_format: 'webp',
          num_outputs: 1,
          go_fast: true,
        },
      }
    );

    console.log('Replicate output type:', typeof output);
    console.log('Replicate output:', JSON.stringify(output));

    // Get the output URL - Flux returns an array of FileOutput objects
    let imageUrl: string | null = null;

    if (Array.isArray(output) && output.length > 0) {
      const first = output[0];
      // FileOutput has a url() method or might be a string
      if (typeof first === 'string') {
        imageUrl = first;
      } else if (first && typeof first === 'object') {
        // Check if it has a url property or is a URL-like object
        if ('url' in first) {
          imageUrl = String(first.url);
        } else if (first.toString && first.toString() !== '[object Object]') {
          imageUrl = first.toString();
        }
      }
    } else if (typeof output === 'string') {
      imageUrl = output;
    }

    if (!imageUrl) {
      console.error('Could not extract URL from output:', output);
      throw new Error('No image URL in output');
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
