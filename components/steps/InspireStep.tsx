'use client';

import { ArrowLeft, Upload, Link, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Inspiration } from '@/types/workflow';

interface InspireStepProps {
  onSelectInspiration: (type: Inspiration['type']) => void;
  onBack: () => void;
}

export function InspireStep({ onSelectInspiration, onBack }: InspireStepProps) {
  return (
    <Card className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        Any inspiration to share?
      </h2>
      <p className="text-gray-500 mb-8 text-center">
        Share examples you love and I&apos;ll capture that energy while keeping it on-brand
      </p>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => onSelectInspiration('upload')}
          className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[var(--brand-blue)] hover:bg-blue-50 transition-all group"
        >
          <Upload className="w-8 h-8 text-gray-400 group-hover:text-[var(--brand-blue)]" />
          <span className="font-medium text-gray-700 group-hover:text-[var(--brand-blue)]">Upload Image</span>
          <span className="text-sm text-gray-500">PNG, JPG, or GIF</span>
        </button>

        <button
          onClick={() => onSelectInspiration('link')}
          className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[var(--brand-blue)] hover:bg-blue-50 transition-all group"
        >
          <Link className="w-8 h-8 text-gray-400 group-hover:text-[var(--brand-blue)]" />
          <span className="font-medium text-gray-700 group-hover:text-[var(--brand-blue)]">Paste a Link</span>
          <span className="text-sm text-gray-500">Instagram, Pinterest, etc.</span>
        </button>

        <button
          onClick={() => onSelectInspiration('skip')}
          className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all group"
        >
          <Sparkles className="w-8 h-8 text-gray-400 group-hover:text-gray-600" />
          <span className="font-medium text-gray-700">Skip for now</span>
          <span className="text-sm text-gray-500">I&apos;ll work my magic</span>
        </button>
      </div>
    </Card>
  );
}
