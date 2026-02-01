'use client';

import { cn } from '@/lib/utils';
import type { Aesthetic } from '@/lib/brand/aesthetics';

interface AestheticCardProps {
  aesthetic: Aesthetic;
  selected?: boolean;
  onClick: () => void;
}

export function AestheticCard({ aesthetic, selected, onClick }: AestheticCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-start gap-4 p-5 border rounded-xl hover:border-[var(--brand-blue)] hover:shadow-md transition-all text-left group w-full',
        selected
          ? 'border-[var(--brand-blue)] bg-blue-50 shadow-md'
          : 'border-gray-200'
      )}
    >
      <span className="text-3xl">{aesthetic.icon}</span>
      <div>
        <div className={cn(
          'font-semibold group-hover:text-[var(--brand-blue)]',
          selected ? 'text-[var(--brand-blue)]' : 'text-gray-800'
        )}>
          {aesthetic.label}
        </div>
        <div className="text-sm text-gray-500">{aesthetic.description}</div>
      </div>
    </button>
  );
}
