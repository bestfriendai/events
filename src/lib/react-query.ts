import { QueryClient } from '@tanstack/react-query';

// Create a new QueryClient with custom default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 1, // Retry failed queries once
    },
    mutations: {
      retry: false, // Don't retry failed mutations
    },
  },
});

// Helper function to invalidate queries by prefix
export const invalidateQueriesByPrefix = async (prefix: string) => {
  await queryClient.invalidateQueries({ queryKey: [prefix] });
};

// Helper function to reset queries by prefix
export const resetQueriesByPrefix = (prefix: string) => {
  queryClient.resetQueries({ queryKey: [prefix] });
};

// Helper function to clear the entire cache
export const clearQueryCache = () => {
  queryClient.clear();
};

// Global error handler for use in individual queries and mutations
export const handleQueryError = (error: unknown) => {
  console.error('Query error:', error);
  
  // Extract error message
  let errorMessage = 'An unexpected error occurred';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = String((error as { message: unknown }).message);
  }
  
  return errorMessage;
};