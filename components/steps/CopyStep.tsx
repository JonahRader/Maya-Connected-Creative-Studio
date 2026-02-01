'use client';

import { Download, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CaptionCard } from '@/components/ui/CaptionCard';
import type { GeneratedImage, Caption } from '@/types/workflow';

interface CopyStepProps {
  generatedImage: GeneratedImage | null;
  captions: Caption[];
  onStartOver: () => void;
}

export function CopyStep({ generatedImage, captions, onStartOver }: CopyStepProps) {
  const handleDownload = async () => {
    if (!generatedImage?.url) return;

    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `connected-${generatedImage.contentType}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        Here&apos;s your final content!
      </h2>
      <p className="text-gray-500 mb-8 text-center">
        Your visual is ready, plus caption options for different tones
      </p>

      <div className="grid grid-cols-2 gap-8">
        {/* Final Image */}
        <div>
          <div className="aspect-square bg-brand-gradient rounded-xl flex items-center justify-center mb-4 overflow-hidden">
            {generatedImage?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={generatedImage.url}
                alt="Final content"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-white p-8">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <p className="font-medium">Final Design</p>
              </div>
            )}
          </div>
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Image
          </button>
        </div>

        {/* Caption Options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Caption Options</h3>

          {captions.map((caption, index) => (
            <CaptionCard key={index} caption={caption} />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={onStartOver} size="lg">
          Create Another
        </Button>
      </div>
    </Card>
  );
}
