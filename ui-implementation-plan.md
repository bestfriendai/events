# UI/UX Implementation Plan

This document provides a detailed implementation plan for the UI/UX enhancements outlined in the comprehensive enhancement plan. It includes specific code examples, component designs, and implementation steps to guide the development process.

## 1. Design System Implementation

### 1.1 Create Design Tokens

First, let's establish a centralized design tokens file to maintain consistency across the application.

```typescript
// src/styles/tokens.ts

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
```

### 1.2 Update Tailwind Configuration

Update the Tailwind configuration to use our design tokens:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { tokens } from './src/styles/tokens';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
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
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
```

### 1.3 Create Theme Provider

Implement a theme provider to manage dark/light mode:

```tsx
// src/components/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      
      root.classList.add(systemTheme);
      return;
    }
    
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  
  return context;
};
```

## 2. Component Redesign Examples

### 2.1 Redesigned EventCard Component

```tsx
// src/components/EventCard.tsx
import { useState } from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Event } from '@/types';
import { formatDistance } from '@/utils/distance';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  isSelected: boolean;
}

export default function EventCard({ event, onClick, isSelected }: EventCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get category icon
  const getCategoryIcon = () => {
    const category = event.category?.toLowerCase() || '';
    
    switch (true) {
      case category.includes('music'):
        return '🎵';
      case category.includes('comedy'):
        return '😄';
      case category.includes('sports'):
        return '⚽';
      case category.includes('art'):
        return '🎨';
      case category.includes('food'):
        return '🍽️';
      default:
        return '📍';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl transition-all duration-300 
        ${isSelected 
          ? 'ring-2 ring-primary-500 bg-background-tertiary' 
          : 'hover:bg-background-secondary'
        }
      `}
    >
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Image */}
        <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-background-tertiary animate-pulse" />
          )}
          
          <img
            src={event.imageUrl || '/placeholder.svg'}
            alt={event.title}
            className={`
              w-full h-full object-cover transition-opacity duration-300
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
          />
          
          <div className="absolute top-2 left-2 bg-background-primary/80 backdrop-blur-sm 
                         text-text-primary px-2 py-1 rounded-md text-xs font-medium">
            {getCategoryIcon()} {event.subcategory || event.category}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-text-primary line-clamp-2">{event.title}</h3>
          
          <div className="mt-2 space-y-1.5">
            {/* Date and Time */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary-400" />
              <span className="text-text-secondary">{event.date}</span>
              {event.time && (
                <>
                  <span className="text-text-tertiary">•</span>
                  <Clock className="w-4 h-4 text-primary-400" />
                  <span className="text-text-secondary">{event.time}</span>
                </>
              )}
            </div>
            
            {/* Location */}
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-error mt-0.5" />
              <div>
                <div className="text-text-secondary">{event.venue?.name}</div>
                <div className="text-text-tertiary text-xs line-clamp-1">
                  {event.location?.address}
                </div>
              </div>
            </div>
          </div>
          
          {/* Distance */}
          {event.distance && (
            <div className="mt-auto pt-2">
              <span className="text-xs bg-primary-500/10 text-primary-400 px-2 py-1 rounded-md">
                {formatDistance(event.distance)} miles away
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Status indicator */}
      {event.status && (
        <div className={`
          absolute top-0 right-0 px-2 py-1 text-xs font-medium
          ${event.status === 'open' 
            ? 'bg-success/20 text-success' 
            : 'bg-error/20 text-error'
          }
        `}>
          {event.status === 'open' ? 'Open' : 'Closed'}
        </div>
      )}
    </div>
  );
}
```

### 2.2 Redesigned SearchBar Component

```tsx
// src/components/SearchBar/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import Suggestions from './Suggestions';

interface SearchBarProps {
  onSearch: (term: string) => void;
  onLocationChange: (location: { latitude: number; longitude: number } | null) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, onLocationChange, isLoading = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationName, setLocationName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { getCurrentPosition } = useGeolocation();

  // Handle search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  // Handle nearby button click
  const handleNearbyClick = async () => {
    setIsLoadingLocation(true);
    
    try {
      const position = await getCurrentPosition();
      
      if (position) {
        onLocationChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationName('Current Location');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle location selection from suggestions
  const handleLocationSelect = (location: { 
    name: string; 
    latitude: number; 
    longitude: number 
  }) => {
    setLocationName(location.name);
    onLocationChange({
      latitude: location.latitude,
      longitude: location.longitude
    });
    setShowSuggestions(false);
  };

  // Clear location
  const handleClearLocation = () => {
    setLocationName('');
    onLocationChange(null);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center gap-2">
        {/* Location Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MapPin className="w-5 h-5 text-text-tertiary" />
          </div>
          
          <Input
            type="text"
            placeholder="Enter location..."
            className="pl-10 pr-10 h-12 bg-background-secondary border-border-medium focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            value={locationName}
            onChange={(e) => {
              setLocationName(e.target.value);
              if (e.target.value === '') {
                onLocationChange(null);
              }
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          
          {locationName && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary hover:text-text-primary"
              onClick={handleClearLocation}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Nearby Button */}
        <Button
          variant="outline"
          className="h-12 px-4 bg-background-secondary border-border-medium hover:bg-background-tertiary"
          onClick={handleNearbyClick}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <MapPin className="w-5 h-5 mr-2" />
              Nearby
            </>
          )}
        </Button>
        
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-text-tertiary" />
          </div>
          
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search events..."
            className="pl-10 h-12 bg-background-secondary border-border-medium focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Search Button */}
        <Button 
          className="h-12 px-6 bg-primary-500 hover:bg-primary-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>
      
      {/* Location Suggestions */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1">
          <Suggestions
            query={locationName}
            onSelect={handleLocationSelect}
            onClose={() => setShowSuggestions(false)}
          />
        </div>
      )}
    </div>
  );
}
```

## 3. Implementation Steps

### 3.1 Phase 1: Foundation Setup

1. Create the design tokens file and update Tailwind configuration
2. Set up the ThemeProvider component
3. Create a component library documentation page
4. Update base components with new design tokens

### 3.2 Phase 2: Component Refactoring

1. Identify high-impact components for initial refactoring
2. Refactor components in this order:
   - Layout components (Header, Sidebar, etc.)
   - Form components (Input, Button, Select, etc.)
   - Content components (Cards, Lists, etc.)
   - Specialized components (Map, Calendar, etc.)

### 3.3 Phase 3: Responsive Design Implementation

1. Implement mobile-first layouts
2. Add responsive breakpoints
3. Test on various device sizes
4. Optimize touch targets for mobile

### 3.4 Phase 4: Accessibility Enhancements

1. Add proper semantic HTML
2. Implement keyboard navigation
3. Add ARIA attributes
4. Test with screen readers
5. Ensure sufficient color contrast

## 4. Testing and Quality Assurance

1. Create visual regression tests for UI components
2. Implement component unit tests
3. Create end-to-end tests for critical user flows
4. Test across different browsers and devices
5. Conduct accessibility audits

## 5. Documentation

1. Document the design system
2. Create component usage examples
3. Document accessibility guidelines
4. Create responsive design guidelines
5. Document theming and customization options
