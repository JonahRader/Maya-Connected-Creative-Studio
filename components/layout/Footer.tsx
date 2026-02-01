'use client';

import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-sm tracking-[0.15em] text-gray-400">
          C<span className="text-[var(--brand-blue)]">O</span>NNECTED
        </span>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4" />
          Powered by Maya AI
        </div>
      </div>
    </footer>
  );
}
