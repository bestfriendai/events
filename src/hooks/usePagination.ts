import { useState, useCallback, useEffect } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  storageKey?: string; // Optional key for persisting pagination state
}

export function usePagination({ 
  initialPage = 1, 
  initialLimit = 20,
  storageKey
}: PaginationOptions = {}) {
  // Initialize state from localStorage if storageKey is provided
  const [page, setPage] = useState<number>(() => {
    if (storageKey) {
      try {
        const savedState = localStorage.getItem(`${storageKey}_page`);
        return savedState ? parseInt(savedState, 10) : initialPage;
      } catch (error) {
        console.error('Error loading pagination state:', error);
        return initialPage;
      }
    }
    return initialPage;
  });
  
  const [limit, setLimit] = useState<number>(() => {
    if (storageKey) {
      try {
        const savedState = localStorage.getItem(`${storageKey}_limit`);
        return savedState ? parseInt(savedState, 10) : initialLimit;
      } catch (error) {
        console.error('Error loading pagination state:', error);
        return initialLimit;
      }
    }
    return initialLimit;
  });
  
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalItems, setTotalItems] = useState<number | null>(null);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(`${storageKey}_page`, page.toString());
        localStorage.setItem(`${storageKey}_limit`, limit.toString());
      } catch (error) {
        console.error('Error saving pagination state:', error);
      }
    }
  }, [page, limit, storageKey]);

  // Go to next page
  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  }, [hasMore]);

  // Go to previous page
  const prevPage = useCallback(() => {
    setPage(prev => (prev > 1 ? prev - 1 : 1));
  }, []);

  // Go to specific page
  const goToPage = useCallback((pageNumber: number) => {
    setPage(Math.max(1, pageNumber));
  }, []);

  // Change items per page
  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  // Reset pagination
  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setHasMore(true);
    setTotalItems(null);
  }, [initialPage, initialLimit]);

  // Calculate pagination metadata
  const metadata = {
    currentPage: page,
    itemsPerPage: limit,
    totalPages: totalItems !== null ? Math.ceil(totalItems / limit) : null,
    totalItems,
    hasMore,
    isFirstPage: page === 1,
    isLastPage: totalItems !== null ? page >= Math.ceil(totalItems / limit) : !hasMore,
    startItem: (page - 1) * limit + 1,
    endItem: totalItems !== null 
      ? Math.min(page * limit, totalItems) 
      : page * limit
  };

  // Update total items count
  const setTotal = useCallback((total: number) => {
    setTotalItems(total);
    setHasMore(page * limit < total);
  }, [page, limit]);

  return {
    // State
    page,
    limit,
    hasMore,
    isLoadingMore,
    totalItems,
    
    // Setters
    setPage,
    setLimit,
    setHasMore,
    setIsLoadingMore,
    setTotal,
    
    // Actions
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    reset,
    
    // Metadata
    metadata
  };
}