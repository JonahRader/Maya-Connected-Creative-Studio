'use client';

import { WorkflowStep, steps } from '@/types/workflow';
import { ProgressSteps } from '@/components/ui/ProgressSteps';

interface HeaderProps {
  currentStep: WorkflowStep;
}

export function Header({ currentStep }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Connected Logo */}
          <div className="flex items-center">
            <span className="text-xl tracking-[0.2em] font-medium text-gray-800">
              C<span className="text-[var(--brand-blue)]">O</span>NNECTED
            </span>
          </div>
          <div className="h-8 w-px bg-gray-300" />
          <div>
            <div className="font-semibold text-gray-800">Creative Studio</div>
            <div className="text-sm text-gray-500">AI Marketing Designer</div>
          </div>
        </div>

        <ProgressSteps currentStep={currentStep} steps={steps} />
      </div>
    </header>
  );
}
