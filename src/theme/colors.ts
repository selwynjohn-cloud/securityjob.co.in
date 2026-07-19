export const colors = {
  navy: '#071D3B',
  navySecondary: '#102F57',
  red: '#C51F2A',
  gold: '#D5A62E',
  white: '#FFFFFF',
  background: '#F3F5F7',
  success: '#15803D',
  warning: '#D97706',
  text: '#071D3B',
  textMuted: '#4B5563',
  border: '#D1D5DB',
  card: '#FFFFFF',
  disabled: '#9CA3AF',
  error: '#B91C1C',
  micListening: '#C51F2A',
} as const;

export type ColorKey = keyof typeof colors;
