// Connected Brand Color System

export const colors = {
  // Primary Palette
  blue: '#369AC4',        // Main brand color, backgrounds, CTAs
  purple: '#26034C',      // Headlines, high-impact, gradient start
  lightGray: '#E6E6E6',   // Backgrounds, cards
  black: '#000000',       // Text, icons

  // Secondary Palette
  lightBlue: '#9DB4D8',   // Soft backgrounds, secondary accents
  gray: '#6E6E6E',        // Body text, captions
  darkNavy: '#061835',    // Premium feel, dark backgrounds
  white: '#FFFFFF',       // Clean backgrounds
} as const;

export const gradient = {
  horizontal: 'linear-gradient(90deg, #26034C 0%, #369AC4 100%)',
  vertical: 'linear-gradient(180deg, #26034C 0%, #369AC4 100%)',
  start: '#26034C',
  end: '#369AC4',
} as const;

export type BrandColor = keyof typeof colors;
