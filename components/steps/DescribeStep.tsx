'use client';

import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChatMessage } from '@/components/ui/ChatMessage';
import { ChatInput } from '@/components/ui/ChatInput';
import type { ChatMessage as ChatMessageType } from '@/types/workflow';

interface DescribeStepProps {
  messages: ChatMessageType[];
  contentType: string | null;
  onSendMessage: (message: string) => void;
  onConfirmContentType: () => void;
  onRejectContentType: () => void;
  onStartOver: () => void;
}

export function DescribeStep({
  messages,
  contentType,
  onSendMessage,
  onConfirmContentType,
  onRejectContentType,
  onStartOver,
}: DescribeStepProps) {
  if (messages.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            What are you working on today?
          </h1>
          <p className="text-gray-500 mb-8">
            Describe what you need and I&apos;ll help bring it to life
          </p>
          <ChatInput
            onSend={onSendMessage}
            placeholder="e.g., I need an Instagram post about our nursing benefits..."
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <button
        onClick={onStartOver}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Start Over
      </button>

      {/* Chat Messages */}
      <div className="space-y-4 mb-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </div>

      {/* Content Type Confirmation */}
      {contentType && (
        <div className="flex gap-3 mt-4">
          <Button onClick={onConfirmContentType}>
            Yes, that&apos;s right!
          </Button>
          <Button variant="secondary" onClick={onRejectContentType}>
            Not quite...
          </Button>
        </div>
      )}

      {/* Input for additional messages */}
      {!contentType && (
        <div className="mt-4">
          <ChatInput onSend={onSendMessage} placeholder="Type your response..." />
        </div>
      )}
    </Card>
  );
}
