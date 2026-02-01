'use client';

import { Sparkles } from 'lucide-react';

export function MayaBadge() {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-sm text-[var(--brand-blue)]">
        <Sparkles className="w-4 h-4" />
        Powered by Maya
      </div>
    </div>
  );
}
