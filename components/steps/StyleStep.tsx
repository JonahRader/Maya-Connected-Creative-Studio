'use client';

import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AestheticCard } from '@/components/ui/AestheticCard';
import { aesthetics } from '@/lib/brand/aesthetics';

interface StyleStepProps {
  selectedAesthetic: string | null;
  onSelectAesthetic: (aestheticId: string) => void;
  onBack: () => void;
}

export function StyleStep({ selectedAesthetic, onSelectAesthetic, onBack }: StyleStepProps) {
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
        What aesthetic are we going for?
      </h2>
      <p className="text-gray-500 mb-8 text-center">
        Pick a style direction - you can mix these too
      </p>

      <div className="grid grid-cols-2 gap-4">
        {aesthetics.map((aesthetic) => (
          <AestheticCard
            key={aesthetic.id}
            aesthetic={aesthetic}
            selected={selectedAesthetic === aesthetic.id}
            onClick={() => onSelectAesthetic(aesthetic.id)}
          />
        ))}
      </div>
    </Card>
  );
}
