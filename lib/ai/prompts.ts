// AI Prompt Templates for Maya Creative Studio

import { colors, gradient } from '@/lib/brand/colors';
import { getAesthetic } from '@/lib/brand/aesthetics';
import { getContentType } from '@/lib/brand/content-types';

interface ImagePromptParams {
  contentType: string;
  aesthetic: string;
  inspiration?: string;
  revision?: string;
  previousPrompt?: string;
}

export function buildImagePrompt({
  contentType,
  aesthetic,
  inspiration,
  revision,
  previousPrompt,
}: ImagePromptParams): string {
  const aestheticData = getAesthetic(aesthetic);
  const contentData = getContentType(contentType.toLowerCase().replace(/\s+/g, '-'));

  const basePrompt = `Create a professional social media marketing image for a healthcare staffing company called "Connected".

BRAND GUIDELINES:
- Primary Blue: ${colors.blue}
- Primary Purple: ${colors.purple}
- Brand Gradient: ${gradient.horizontal}
- Typography: Raleway font family
- Logo: "CONNECTED" wordmark with molecular node icon as the O

CONTENT TYPE: ${contentType}
${contentData ? `- Purpose: ${contentData.purpose}
- Format: ${contentData.format}
- Visual Notes: ${contentData.visualNotes}` : ''}

AESTHETIC STYLE: ${aestheticData?.label || aesthetic}
${aestheticData ? `- Characteristics: ${aestheticData.characteristics.join(', ')}
- Color Application: ${aestheticData.colorApplication}
- Best For: ${aestheticData.bestFor.join(', ')}` : ''}

REQUIREMENTS:
- Professional healthcare/staffing industry appropriate
- Clean, modern design suitable for Instagram and LinkedIn
- Include space for Connected branding
- Mobile-friendly, readable at small sizes
- No text overlay needed (will be added separately)
- High contrast, visually striking`;

  if (revision && previousPrompt) {
    return `${basePrompt}

REVISION REQUEST: Adjust the ${revision} of the previous design.
Previous design description: ${previousPrompt}

Focus on improving the ${revision} while maintaining the overall brand consistency.`;
  }

  if (inspiration) {
    return `${basePrompt}

INSPIRATION: The user provided inspiration. Capture the energy and style while staying true to Connected's brand guidelines.`;
  }

  return basePrompt;
}

interface CaptionPromptParams {
  contentType: string;
  aesthetic: string;
  imageDescription?: string;
}

export function buildCaptionPrompt({
  contentType,
  aesthetic,
  imageDescription,
}: CaptionPromptParams): string {
  return `You are Maya, the Creative Director at Connected, a healthcare staffing company. Generate 4 social media captions for a ${contentType} post with a ${aesthetic} aesthetic.

ABOUT CONNECTED:
- Healthcare staffing company placing travel nurses, allied health professionals, educators, and government contractors nationwide
- Serves healthcare, educational services, and government services sectors
- Brand voice: confident, creative, collaborative, professional but approachable

${imageDescription ? `IMAGE DESCRIPTION: ${imageDescription}` : ''}

Generate exactly 4 captions, one for each tone:

1. PROFESSIONAL
- LinkedIn-friendly, industry terminology
- Minimal or no emojis
- Focus on career growth and professional opportunities

2. CONVERSATIONAL
- Friendly, uses "you/your" language
- Light use of emojis (1-2)
- Relatable, warm tone

3. URGENT/ACTION
- CTA-driven, creates FOMO
- Specific details if possible
- Clear call to action

4. PLAYFUL
- POV statements or relatable humor
- More emojis welcome
- Trending social media style

For each caption, include:
- The caption text (2-3 sentences)
- 3-5 relevant hashtags
- Best platform fit (LinkedIn, Instagram, Facebook, TikTok)

Format your response as JSON:
{
  "captions": [
    {
      "tone": "professional",
      "text": "...",
      "hashtags": "#...",
      "platform": "LinkedIn"
    },
    ...
  ]
}`;
}

export function buildInspirationAnalysisPrompt(): string {
  return `Analyze this inspiration image for a healthcare staffing company's marketing content.

Identify:
1. Color treatment and palette
2. Typography style
3. Composition and layout
4. Overall energy/mood
5. Key design elements that work well

Provide specific observations that can be translated into Connected's brand (using their blue #369AC4 and purple #26034C).

Keep the analysis concise and actionable for image generation.`;
}
