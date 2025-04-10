/**
 * Design tokens for EventMap Magic
 * 
 * This file contains all the design tokens used throughout the application.
 * It serves as a single source of truth for colors, typography, spacing, etc.
 */

export const tokens = {
  colors: {
    // Primary colors
    primary: {
      50: '#e6f1fe',
      100: '#cce3fd',
      200: '#99c7fb',
      300: '#66aaf9',
      400: '#338ef7',
      500: '#0072f5', // Primary brand color
      600: '#005bc4',
      700: '#004493',
      800: '#002e62',
      900: '#001731',
    },
    // Secondary colors
    secondary: {
      50: '#f2f2f2',
      100: '#e6e6e6',
      200: '#cccccc',
      300: '#b3b3b3',
      400: '#999999',
      500: '#808080', // Secondary brand color
      600: '#666666',
      700: '#4d4d4d',
      800: '#333333',
      900: '#1a1a1a',
    },
    // Accent colors
    accent: {
      50: '#e6fcf5',
      100: '#ccf9eb',
      200: '#99f3d6',
      300: '#66edc2',
      400: '#33e7ad',
      500: '#00e199', // Accent brand color
      600: '#00b47a',
      700: '#00875c',
      800: '#005a3d',
      900: '#002d1f',
    },
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    // Background colors
    background: {
      primary: '#000000',
      secondary: '#111111',
      tertiary: '#1a1a1a',
    },
    // Text colors
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      tertiary: '#71717a',
      disabled: '#52525b',
    },
    // Border colors
    border: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.15)',
      heavy: 'rgba(255, 255, 255, 0.2)',
    },
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },
  transitions: {
    DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    timing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
  },
};