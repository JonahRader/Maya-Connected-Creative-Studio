'use client';

import { Check } from 'lucide-react';
import { WorkflowStep } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface Step {
  id: WorkflowStep;
  label: string;
}

interface ProgressStepsProps {
  currentStep: WorkflowStep;
  steps: Step[];
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  const getStepStatus = (stepId: WorkflowStep): 'completed' | 'active' | 'upcoming' => {
    const stepOrder = steps.map(s => s.id);
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                status === 'active' && 'bg-[var(--brand-blue)] text-white',
                status === 'completed' && 'bg-blue-100 text-[var(--brand-blue)]',
                status === 'upcoming' && 'text-gray-400'
              )}
            >
              {status === 'completed' && <Check className="inline w-3 h-3 mr-1" />}
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <span className="text-gray-300">›</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
