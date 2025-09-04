import { Platform } from 'react-native';

export const COLORS = {
  primary: '#2E7D32',
  secondary: '#CDE7D0',
  background: '#FFFFFF',
  accent: '#8B4513',
  text: '#333333',
  textLight: '#666666',
  error: '#D32F2F',
  errorLight: '#FFCDD2',
  success: '#2E7D32',
  successLight: '#E2F4E4',
  warning: '#E7B000',
  info: '#1976D2',
  border: '#E6EBE6',
  disabled: '#9E9E9E',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const theme = {
  colors: COLORS,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  typography: {
    fontFamily: {
      regular: 'Roboto-Regular',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
      mono: Platform.select({
        ios: 'Menlo',
        android: 'monospace',
      }),
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
}; 