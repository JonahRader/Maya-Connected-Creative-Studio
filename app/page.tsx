'use client';

import { useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MayaBadge } from '@/components/layout/MayaBadge';
import { DescribeStep } from '@/components/steps/DescribeStep';
import { InspireStep } from '@/components/steps/InspireStep';
import { StyleStep } from '@/components/steps/StyleStep';
import { CreateStep } from '@/components/steps/CreateStep';
import { RefineStep } from '@/components/steps/RefineStep';
import { CopyStep } from '@/components/steps/CopyStep';
import { useCreativeWorkflow } from '@/hooks/useCreativeWorkflow';
import { contentTypes, contentTypeKeywords } from '@/lib/brand/content-types';
import type { Inspiration, Caption } from '@/types/workflow';

export default function Home() {
  const { state, actions } = useCreativeWorkflow();

  // Detect content type from user message
  const detectContentType = useCallback((message: string): string | null => {
    const lowerMessage = message.toLowerCase();

    for (const [typeId, keywords] of Object.entries(contentTypeKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        const contentType = contentTypes.find(ct => ct.id === typeId);
        return contentType?.label || null;
      }
    }

    // Default to Job Spotlight if no match but mentions content
    if (lowerMessage.includes('post') || lowerMessage.includes('content') || lowerMessage.includes('image')) {
      return 'Job Opportunity Spotlight';
    }

    return null;
  }, []);

  // Handle sending a message in the describe step
  const handleSendMessage = useCallback((message: string) => {
    // Add user message
    actions.addMessage({ role: 'user', content: message });

    // Detect content type if not already set
    if (!state.contentType) {
      const detectedType = detectContentType(message);
      if (detectedType) {
        actions.setContentType(detectedType);
        // Add Maya's response
        setTimeout(() => {
          actions.addMessage({
            role: 'assistant',
            content: `Sounds like a ${detectedType} piece - does that feel right?`,
          });
        }, 500);
      } else {
        // Ask for more details
        setTimeout(() => {
          actions.addMessage({
            role: 'assistant',
            content: "I'd love to help! Could you tell me more about what you're looking to create? For example: Is it for a job posting, educational content, or something else?",
          });
        }, 500);
      }
    }
  }, [state.contentType, actions, detectContentType]);

  // Handle content type confirmation
  const handleConfirmContentType = useCallback(() => {
    actions.setStep('inspire');
  }, [actions]);

  const handleRejectContentType = useCallback(() => {
    actions.setContentType('');
    actions.addMessage({
      role: 'assistant',
      content: "No problem! Tell me more about what you're working on and I'll help identify the right approach.",
    });
  }, [actions]);

  // Handle inspiration selection
  const handleSelectInspiration = useCallback((type: Inspiration['type']) => {
    actions.setInspiration({ type });
    actions.setStep('style');
  }, [actions]);

  // Handle aesthetic selection
  const handleSelectAesthetic = useCallback(async (aestheticId: string) => {
    actions.setAesthetic(aestheticId);
    actions.setStep('create');
    actions.setLoading(true);

    try {
      // Call the image generation API
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: state.contentType,
          aesthetic: aestheticId,
          inspiration: state.inspiration,
        }),
      });

      if (!response.ok) throw new Error('Image generation failed');

      const data = await response.json();

      actions.setGeneratedImage({
        url: data.imageUrl,
        prompt: data.prompt,
        aesthetic: aestheticId,
        contentType: state.contentType || 'content',
        timestamp: new Date(),
      });

      actions.setStep('refine');
    } catch (error) {
      console.error('Image generation error:', error);
      // For now, proceed to refine step even without image
      actions.setStep('refine');
    } finally {
      actions.setLoading(false);
    }
  }, [state.contentType, state.inspiration, actions]);

  // Handle revision request
  const handleRevision = useCallback(async (aspect: string) => {
    if (state.revisionCount >= 2) return;

    actions.incrementRevision();
    actions.setLoading(true);
    actions.setStep('create');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: state.contentType,
          aesthetic: state.aesthetic,
          inspiration: state.inspiration,
          revision: aspect,
          previousPrompt: state.generatedImage?.prompt,
        }),
      });

      if (!response.ok) throw new Error('Revision failed');

      const data = await response.json();

      actions.setGeneratedImage({
        url: data.imageUrl,
        prompt: data.prompt,
        aesthetic: state.aesthetic || 'modern',
        contentType: state.contentType || 'content',
        timestamp: new Date(),
      });

      actions.setStep('refine');
    } catch (error) {
      console.error('Revision error:', error);
      actions.setStep('refine');
    } finally {
      actions.setLoading(false);
    }
  }, [state, actions]);

  // Handle approval and move to captions
  const handleApprove = useCallback(async () => {
    actions.setLoading(true);

    try {
      const response = await fetch('/api/generate-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: state.contentType,
          aesthetic: state.aesthetic,
          imageDescription: state.generatedImage?.prompt,
        }),
      });

      if (!response.ok) throw new Error('Caption generation failed');

      const data = await response.json();
      actions.setCaptions(data.captions as Caption[]);
    } catch (error) {
      console.error('Caption generation error:', error);
      // Use fallback captions
      actions.setCaptions([
        {
          tone: 'professional',
          text: 'Ready to take your career nationwide? Connected places professionals in top organizations across all 50 states.',
          hashtags: '#CareerGrowth #Staffing #ConnectedCareers',
          platform: 'LinkedIn',
        },
        {
          tone: 'conversational',
          text: 'New city. New adventure. Same passion for what you do. That\'s the traveling professional life.',
          hashtags: '#TravelCareers #NewOpportunities #Connected',
          platform: 'Instagram',
        },
        {
          tone: 'urgent',
          text: '15+ positions open NOW with weekly pay. Don\'t wait - these fill fast. Link in bio to apply today.',
          hashtags: '#HiringNow #ApplyToday #JobAlert',
          platform: 'Instagram, Facebook',
        },
        {
          tone: 'playful',
          text: 'POV: You just landed your dream assignment and your recruiter already has your housing sorted. This could be you.',
          hashtags: '#WorkLifeBalance #DreamJob #LivingMyBestLife',
          platform: 'Instagram, TikTok',
        },
      ]);
    } finally {
      actions.setLoading(false);
      actions.setStep('copy');
    }
  }, [state, actions]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentStep={state.currentStep} />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <MayaBadge />

          {state.currentStep === 'describe' && (
            <DescribeStep
              messages={state.messages}
              contentType={state.contentType}
              onSendMessage={handleSendMessage}
              onConfirmContentType={handleConfirmContentType}
              onRejectContentType={handleRejectContentType}
              onStartOver={actions.reset}
            />
          )}

          {state.currentStep === 'inspire' && (
            <InspireStep
              onSelectInspiration={handleSelectInspiration}
              onBack={() => actions.setStep('describe')}
            />
          )}

          {state.currentStep === 'style' && (
            <StyleStep
              selectedAesthetic={state.aesthetic}
              onSelectAesthetic={handleSelectAesthetic}
              onBack={() => actions.setStep('inspire')}
            />
          )}

          {state.currentStep === 'create' && (
            <CreateStep
              aesthetic={state.aesthetic}
              contentType={state.contentType}
            />
          )}

          {state.currentStep === 'refine' && (
            <RefineStep
              generatedImage={state.generatedImage}
              contentType={state.contentType}
              aesthetic={state.aesthetic}
              revisionCount={state.revisionCount}
              onRevision={handleRevision}
              onApprove={handleApprove}
              onBack={() => actions.setStep('style')}
            />
          )}

          {state.currentStep === 'copy' && (
            <CopyStep
              generatedImage={state.generatedImage}
              captions={state.captions}
              onStartOver={actions.reset}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
