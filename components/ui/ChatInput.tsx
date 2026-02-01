'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSend, placeholder = 'Type your message...', disabled }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--brand-blue)] text-white rounded-lg hover:bg-[#2d8ab3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
