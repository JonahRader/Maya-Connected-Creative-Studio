'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          // Variants
          variant === 'primary' && 'bg-[var(--brand-blue)] text-white hover:bg-[#2d8ab3] focus:ring-[var(--brand-blue)]',
          variant === 'secondary' && 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
          variant === 'ghost' && 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
          // Sizes
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-4 py-2 text-sm',
          size === 'lg' && 'px-6 py-3 text-base',
          // Disabled
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
