'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { Caption } from '@/types/workflow';

interface CaptionCardProps {
  caption: Caption;
}

const toneLabels: Record<Caption['tone'], string> = {
  professional: 'Professional',
  conversational: 'Conversational',
  urgent: 'Urgent/Action',
  playful: 'Playful',
};

export function CaptionCard({ caption }: CaptionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullText = `${caption.text}\n\n${caption.hashtags}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-800">{toneLabels[caption.tone]}</span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {caption.platform}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{caption.text}</p>
      <p className="text-xs text-[var(--brand-blue)] mb-3">{caption.hashtags}</p>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--brand-blue)] transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy caption
          </>
        )}
      </button>
    </div>
  );
}
