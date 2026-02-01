import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildCaptionPrompt } from '@/lib/ai/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, aesthetic, imageDescription } = body;

    if (!contentType) {
      return NextResponse.json(
        { error: 'Missing required field: contentType' },
        { status: 400 }
      );
    }

    // Build the prompt
    const prompt = buildCaptionPrompt({
      contentType,
      aesthetic: aesthetic || 'modern',
      imageDescription,
    });

    // Check if API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY not configured, returning fallback captions');
      return NextResponse.json({
        captions: getFallbackCaptions(contentType),
        message: 'Using fallback - configure ANTHROPIC_API_KEY for AI generation',
      });
    }

    // Initialize Anthropic
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text content
    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse JSON response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse caption JSON');
    }

    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      captions: data.captions,
    });
  } catch (error) {
    console.error('Caption generation error:', error);

    // Return fallback captions on error
    const body = await request.clone().json().catch(() => ({}));
    return NextResponse.json({
      captions: getFallbackCaptions(body.contentType || 'content'),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

function getFallbackCaptions(contentType: string) {
  return [
    {
      tone: 'professional',
      text: `Ready to take your career nationwide? Connected places ${contentType.toLowerCase().includes('nurse') ? 'nursing' : 'healthcare'} professionals in top organizations across all 50 states - with competitive pay, full benefits, and a dedicated team in your corner.`,
      hashtags: '#CareerGrowth #HealthcareStaffing #ConnectedCareers #TravelHealthcare',
      platform: 'LinkedIn',
    },
    {
      tone: 'conversational',
      text: `New city. New adventure. Same passion for what you do. That's the traveling professional life - and we're here to make it happen for you.`,
      hashtags: '#TravelCareers #NewOpportunities #Connected #HealthcareJobs',
      platform: 'Instagram',
    },
    {
      tone: 'urgent',
      text: `15+ positions open NOW with weekly pay. Don't wait - these fill fast! Link in bio to apply today and start your next adventure.`,
      hashtags: '#HiringNow #ApplyToday #JobAlert #HealthcareJobs #WeeklyPay',
      platform: 'Instagram, Facebook',
    },
    {
      tone: 'playful',
      text: `POV: You just landed your dream assignment and your recruiter already has your housing sorted. This could be you. Seriously.`,
      hashtags: '#WorkLifeBalance #DreamJob #LivingMyBestLife #TravelNurse #ConnectedLife',
      platform: 'Instagram, TikTok',
    },
  ];
}
