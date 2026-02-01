import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { buildImagePrompt } from '@/lib/ai/prompts';

// Get credentials from environment
function getCredentials() {
  const credentialsJson = process.env.GOOGLE_CLOUD_CREDENTIALS;
  if (!credentialsJson) {
    return null;
  }
  try {
    return JSON.parse(credentialsJson);
  } catch {
    return null;
  }
}

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

    const credentials = getCredentials();

    if (!credentials) {
      console.warn('GOOGLE_CLOUD_CREDENTIALS not configured, returning placeholder');
      return NextResponse.json({
        imageUrl: `https://placehold.co/1080x1080/369AC4/FFFFFF?text=${encodeURIComponent(contentType)}`,
        prompt,
        message: 'Using placeholder - configure GOOGLE_CLOUD_CREDENTIALS for real generation',
      });
    }

    // Initialize Vertex AI
    const vertexAI = new VertexAI({
      project: credentials.project_id,
      location: 'us-central1',
      googleAuthOptions: {
        credentials: credentials,
      },
    });

    // Use Imagen 3 for image generation
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'imagen-3.0-generate-001',
    });

    // Generate image
    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response;

    // Check for generated images in the response
    let imageUrl = null;

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if ('inlineData' in part && part.inlineData) {
          const { mimeType, data } = part.inlineData;
          imageUrl = `data:${mimeType};base64,${data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      // Fallback to placeholder if no image generated
      imageUrl = `https://placehold.co/1080x1080/369AC4/FFFFFF?text=${encodeURIComponent(contentType)}`;
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
