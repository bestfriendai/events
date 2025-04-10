# Backend Architecture Implementation Plan

This document provides a detailed implementation plan for the backend architecture enhancements outlined in the comprehensive enhancement plan.

## 1. API Layer Optimization

### 1.1 Create a Unified API Client

First, let's implement a centralized API client with consistent error handling and caching:

```typescript
// src/services/api/client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Error types
export enum ErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  SERVER = 'server',
  UNAUTHORIZED = 'unauthorized',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

// API error structure
export interface ApiError {
  type: ErrorType;
  status?: number;
  message: string;
  details?: any;
  originalError?: any;
}

// Response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

// API client options
export interface ApiClientOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

export class ApiClient {
  private instance: AxiosInstance;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(options: ApiClientOptions) {
    this.instance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      withCredentials: options.withCredentials || false
    });

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Cancel previous requests with the same requestId if they exist
        if (config.headers?.['X-Request-ID']) {
          const requestId = config.headers['X-Request-ID'] as string;
          if (this.abortControllers.has(requestId)) {
            this.abortControllers.get(requestId)?.abort();
          }
          
          const controller = new AbortController();
          config.signal = controller.signal;
          this.abortControllers.set(requestId, controller);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError = this.handleError(error);
        return Promise.reject(apiError);
      }
    );
  }

  // Process API errors into a consistent format
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with an error status
      const status = error.response.status;
      const data = error.response.data as any;
      
      switch (status) {
        case 401:
          return {
            type: ErrorType.UNAUTHORIZED,
            status,
            message: 'Authentication required',
            details: data,
            originalError: error
          };
        case 404:
          return {
            type: ErrorType.NOT_FOUND,
            status,
            message: 'Resource not found',
            details: data,
            originalError: error
          };
        default:
          return {
            type: ErrorType.SERVER,
            status,
            message: data?.message || 'Server error',
            details: data,
            originalError: error
          };
      }
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        return {
          type: ErrorType.TIMEOUT,
          message: 'Request timed out',
          originalError: error
        };
      }
      
      return {
        type: ErrorType.NETWORK,
        message: 'Network error',
        originalError: error
      };
    }
    
    // Something else happened
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || 'Unknown error',
      originalError: error
    };
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<T>(url, config);
      return {
        data: response.data,
        error: null,
        isLoading: false
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        data: null,
        error: apiError,
        isLoading: false
      };
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<T>(url, data, config);
      return {
        data: response.data,
        error: null,
        isLoading: false
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        data: null,
        error: apiError,
        isLoading: false
      };
    }
  }

  // Additional methods (put, patch, delete) would follow the same pattern
}

// Create API client instances
export const createApiClient = (options: ApiClientOptions) => new ApiClient(options);

// Default API client
export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});
```

### 1.2 Implement Service-Specific API Modules

Create service-specific API modules that use the unified client:

```typescript
// src/services/api/events.ts
import { apiClient } from './client';
import { Event, Filter } from '@/types';

export interface EventsSearchParams {
  latitude: number;
  longitude: number;
  filters?: Filter;
  page?: number;
  limit?: number;
}

export interface EventsResponse {
  events: Event[];
  totalCount: number;
  hasMore: boolean;
}

export const eventsApi = {
  // Search for events
  async searchEvents(params: EventsSearchParams) {
    return apiClient.get<EventsResponse>('/events/search', {
      params,
      headers: {
        'X-Request-ID': `events-search-${params.latitude}-${params.longitude}`
      }
    });
  },
  
  // Get event details
  async getEvent(id: string) {
    return apiClient.get<Event>(`/events/${id}`);
  }
};
```

### 1.3 Create API Hooks with React Query

Implement custom hooks using React Query for data fetching with automatic caching:

```typescript
// src/hooks/api/useEvents.ts
import { useQuery } from '@tanstack/react-query';
import { eventsApi, EventsSearchParams } from '@/services/api/events';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  search: (params: EventsSearchParams) => [...eventKeys.all, 'search', params] as const,
  detail: (id: string) => [...eventKeys.all, 'detail', id] as const
};

// Hook for searching events
export function useEventsSearch(params: EventsSearchParams) {
  return useQuery({
    queryKey: eventKeys.search(params),
    queryFn: () => eventsApi.searchEvents(params),
    enabled: Boolean(params.latitude && params.longitude),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
}

// Hook for getting event details
export function useEventDetails(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getEvent(id),
    enabled: Boolean(id),
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
}
```

## 2. State Management Refinement

### 2.1 Create Context Providers for Shared State

Implement context providers for shared application state:

```typescript
// src/contexts/LocationContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

interface LocationContextType {
  userLocation: Location | null;
  searchLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  setSearchLocation: (location: Location | null) => void;
  clearSearchLocation: () => void;
  refreshUserLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [searchLocation, setSearchLocation] = useState<Location | null>(null);
  const { location: geoLocation, isLoading, error, getCurrentPosition } = useGeolocation();
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  // Update user location when geolocation changes
  useEffect(() => {
    if (geoLocation) {
      setUserLocation({
        latitude: geoLocation.coords.latitude,
        longitude: geoLocation.coords.longitude,
        name: 'Current Location'
      });
    }
  }, [geoLocation]);

  // Refresh user location
  const refreshUserLocation = async () => {
    try {
      await getCurrentPosition();
    } catch (error) {
      console.error('Failed to refresh user location:', error);
    }
  };

  // Clear search location
  const clearSearchLocation = () => {
    setSearchLocation(null);
  };

  const value = {
    userLocation,
    searchLocation,
    isLoading,
    error,
    setSearchLocation,
    clearSearchLocation,
    refreshUserLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  
  return context;
}
```

### 2.2 Implement Custom Hooks for Reusable State Logic

Create custom hooks for common state patterns:

```typescript
// src/hooks/usePagination.ts
import { useState, useCallback } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({ initialPage = 1, initialLimit = 20 }: PaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  }, [hasMore]);

  const prevPage = useCallback(() => {
    setPage(prev => (prev > 1 ? prev - 1 : 1));
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setHasMore(true);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    hasMore,
    isLoadingMore,
    setHasMore,
    setIsLoadingMore,
    nextPage,
    prevPage,
    reset
  };
}
```

## 3. Performance Optimization

### 3.1 Implement Code Splitting

Configure code splitting using React.lazy and Suspense:

```typescript
// src/App.tsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/react-query';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const RestaurantsPage = lazy(() => import('./pages/RestaurantsPage'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/assistant" element={<AIAssistant />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

## 4. Implementation Steps

### 4.1 Phase 1: Foundation

1. Set up the unified API client
2. Create service-specific API modules
3. Implement React Query for data fetching
4. Set up context providers for shared state

### 4.2 Phase 2: Performance Optimization

1. Implement code splitting
2. Add virtualization for long lists
3. Optimize map rendering with clustering
4. Implement service worker for caching

### 4.3 Phase 3: Security Enhancements

1. Move API keys to environment variables
2. Implement proper input validation
3. Set up API proxies for third-party services
4. Add rate limiting for API requests

### 4.4 Phase 4: Testing and Monitoring

1. Set up unit tests for API services
2. Implement integration tests for critical flows
3. Add error monitoring and reporting
4. Set up performance monitoring
