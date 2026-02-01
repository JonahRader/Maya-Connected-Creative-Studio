'use client';

import type { ChatMessage as ChatMessageType } from '@/types/workflow';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === 'assistant') {
    return (
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold flex-shrink-0">
          M
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">Maya</span>
            <span className="w-2 h-2 bg-green-400 rounded-full" />
          </div>
          <div className="bg-gray-100 rounded-xl rounded-tl-none px-4 py-3 text-gray-700">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="bg-[var(--brand-blue)] text-white rounded-xl rounded-tr-none px-4 py-3 max-w-md">
        {message.content}
      </div>
    </div>
  );
}
