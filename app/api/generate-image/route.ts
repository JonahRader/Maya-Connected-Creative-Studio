import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildImagePrompt } from '@/lib/ai/prompts';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

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

    // Check if API key is available
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.warn('GOOGLE_AI_API_KEY not configured, returning placeholder');
      return NextResponse.json({
        imageUrl: `https://placehold.co/1080x1080/369AC4/FFFFFF?text=${encodeURIComponent(contentType)}`,
        prompt,
        message: 'Using placeholder - configure GOOGLE_AI_API_KEY for real generation',
      });
    }

    // Use Gemini for image generation
    // Note: Gemini 2.0 Flash supports image generation
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt + '\n\nGenerate an image based on these specifications.',
            },
          ],
        },
      ],
      generationConfig: {
        // Request image generation
        responseMimeType: 'text/plain',
      },
    });

    const response = result.response;
    const text = response.text();

    // Check if we got an image in the response
    // Gemini returns images as inline data in certain models
    const candidates = response.candidates;
    let imageUrl = null;

    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if ('inlineData' in part && part.inlineData) {
          // Convert base64 image to data URL
          const { mimeType, data } = part.inlineData;
          imageUrl = `data:${mimeType};base64,${data}`;
          break;
        }
      }
    }

    // If no image was generated, use a placeholder
    if (!imageUrl) {
      imageUrl = `https://placehold.co/1080x1080/369AC4/FFFFFF?text=${encodeURIComponent(contentType)}`;
    }

    return NextResponse.json({
      imageUrl,
      prompt,
      description: text,
    });
  } catch (error) {
    console.error('Image generation error:', error);

    // Return placeholder on error
    return NextResponse.json({
      imageUrl: 'https://placehold.co/1080x1080/369AC4/FFFFFF?text=Content+Preview',
      prompt: 'Error generating image',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
