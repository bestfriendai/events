import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import tailwindcssAnimate from "tailwindcss-animate";
import { tokens } from "./src/styles/tokens";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Keep existing color variables for compatibility with shadcn/ui
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Add our token-based colors with different names to avoid conflicts
        primaryToken: tokens.colors.primary,
        secondaryToken: tokens.colors.secondary,
        accentToken: tokens.colors.accent,
        successToken: { DEFAULT: tokens.colors.success },
        warningToken: { DEFAULT: tokens.colors.warning },
        errorToken: { DEFAULT: tokens.colors.error },
        infoToken: { DEFAULT: tokens.colors.info },
        bgToken: tokens.colors.background,
        textToken: tokens.colors.text,
        borderToken: tokens.colors.border,
        
        // Keep existing color objects for compatibility with shadcn/ui
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        // Merge existing font families with our tokens
        sans: tokens.typography.fontFamily.sans,
        mono: tokens.typography.fontFamily.mono,
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Use our token-based font sizes
        ...tokens.typography.fontSize,
        // Keep larger sizes from existing config
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,
      borderRadius: {
        // Merge existing border radius with our tokens
        ...tokens.borderRadius,
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      spacing: {
        // Merge existing spacing with our tokens
        ...tokens.spacing,
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      boxShadow: tokens.shadows,
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: tokens.transitions.timing,
      transitionDuration: {
        'DEFAULT': '150ms',
        'fast': '100ms',
        'slow': '300ms',
      },
      zIndex: tokens.zIndex,
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out"
      },
    },
  },
  plugins: [tailwindcssAnimate, nextui()],
} satisfies Config;
