import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildInspirationAnalysisPrompt } from '@/lib/ai/prompts';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (!image && !imageUrl) {
      return NextResponse.json(
        { error: 'Either image file or imageUrl is required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({
        analysis: 'API key not configured. The inspiration will be noted but not analyzed.',
        success: false,
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = buildInspirationAnalysisPrompt();

    let result;

    if (image) {
      // Convert file to base64
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');

      result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: image.type,
                  data: base64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
      });
    } else if (imageUrl) {
      // Fetch image from URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      const base64 = buffer.toString('base64');

      result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: blob.type,
                  data: base64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
      });
    }

    if (!result) {
      throw new Error('No result from analysis');
    }

    const text = result.response.text();

    return NextResponse.json({
      analysis: text,
      success: true,
    });
  } catch (error) {
    console.error('Inspiration analysis error:', error);
    return NextResponse.json({
      analysis: 'Could not analyze the inspiration image.',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    });
  }
}
