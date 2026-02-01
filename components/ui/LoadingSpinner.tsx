'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-4 border-[var(--brand-blue)] border-t-transparent',
        size === 'sm' && 'w-6 h-6',
        size === 'md' && 'w-12 h-12',
        size === 'lg' && 'w-16 h-16',
        className
      )}
    />
  );
}
