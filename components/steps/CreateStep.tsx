'use client';

import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface CreateStepProps {
  aesthetic: string | null;
  contentType: string | null;
}

export function CreateStep({ aesthetic, contentType }: CreateStepProps) {
  return (
    <Card className="p-12 text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-6" />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Creating your {aesthetic} design...
      </h2>
      <p className="text-gray-500">
        {contentType ? `Generating ${contentType} content` : 'This usually takes a few seconds'}
      </p>
    </Card>
  );
}
