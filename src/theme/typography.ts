import { TextStyle } from 'react-native';
import { colors } from './colors';

/** Guard-friendly spacing — large tap targets on ordinary Android/iPhones */
export const spacing = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 28,
  xl: 36,
  xxl: 48,
} as const;

export const typography = {
  hero: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 42,
  } as TextStyle,
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.navy,
    lineHeight: 36,
  } as TextStyle,
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.navy,
    lineHeight: 30,
  } as TextStyle,
  body: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 30,
  } as TextStyle,
  bodyLarge: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 32,
  } as TextStyle,
  caption: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 22,
  } as TextStyle,
  button: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  } as TextStyle,
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.navySecondary,
    lineHeight: 26,
  } as TextStyle,
} as const;
