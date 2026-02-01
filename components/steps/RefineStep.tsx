'use client';

import { ArrowLeft, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { GeneratedImage } from '@/types/workflow';

interface RefineStepProps {
  generatedImage: GeneratedImage | null;
  contentType: string | null;
  aesthetic: string | null;
  revisionCount: number;
  maxRevisions?: number;
  onRevision: (aspect: string) => void;
  onApprove: () => void;
  onBack: () => void;
}

const revisionOptions = ['Colors', 'Layout', 'Text', 'Vibe', 'Elements'];

export function RefineStep({
  generatedImage,
  contentType,
  aesthetic,
  revisionCount,
  maxRevisions = 3,
  onRevision,
  onApprove,
  onBack,
}: RefineStepProps) {
  const canRevise = revisionCount < maxRevisions - 1;

  return (
    <Card className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-2 gap-8">
        {/* Generated Image */}
        <div>
          <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
            {generatedImage?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={generatedImage.url}
                alt="Generated content"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8">
                <ImageIcon className="w-16 h-16 text-[var(--brand-blue)] mx-auto mb-4" />
                <p className="text-gray-600">Generated {contentType}</p>
                <p className="text-sm text-gray-400 mt-2">{aesthetic} aesthetic</p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Revision {revisionCount + 1} of {maxRevisions}
          </p>
        </div>

        {/* Refinement Options */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">What do you think?</h3>

          <div className="space-y-3 mb-6">
            {revisionOptions.map((option) => (
              <button
                key={option}
                onClick={() => onRevision(option.toLowerCase())}
                disabled={!canRevise}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:border-[var(--brand-blue)] hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-gray-700">Adjust {option}</span>
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>

          <Button onClick={onApprove} size="lg" className="w-full">
            Looks great! Continue →
          </Button>

          {!canRevise && (
            <p className="text-sm text-amber-600 mt-3 text-center">
              Max revisions reached. Click continue or start over.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
