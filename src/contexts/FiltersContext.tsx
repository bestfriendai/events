import { createContext, useContext, useState, ReactNode } from 'react';
import { Filter } from '@/types';
import { RestaurantFilter } from '@/types/restaurant';

interface FiltersContextType {
  eventFilters: Filter;
  restaurantFilters: RestaurantFilter;
  updateEventFilters: (filters: Partial<Filter>) => void;
  updateRestaurantFilters: (filters: Partial<RestaurantFilter>) => void;
  resetEventFilters: () => void;
  resetRestaurantFilters: () => void;
}

const defaultEventFilters: Filter = {
  category: undefined,
  dateRange: undefined,
  distance: 30,
  priceRange: undefined,
};

const defaultRestaurantFilters: RestaurantFilter = {
  categories: [],
  price: [],
  rating: 0,
  distance: 30,
  openNow: false
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [eventFilters, setEventFilters] = useState<Filter>(() => {
    // Try to load saved filters from localStorage
    try {
      const savedFilters = localStorage.getItem('eventFilters');
      return savedFilters ? JSON.parse(savedFilters) : defaultEventFilters;
    } catch (error) {
      console.error('Error loading saved event filters:', error);
      return defaultEventFilters;
    }
  });
  
  const [restaurantFilters, setRestaurantFilters] = useState<RestaurantFilter>(() => {
    // Try to load saved filters from localStorage
    try {
      const savedFilters = localStorage.getItem('restaurantFilters');
      return savedFilters ? JSON.parse(savedFilters) : defaultRestaurantFilters;
    } catch (error) {
      console.error('Error loading saved restaurant filters:', error);
      return defaultRestaurantFilters;
    }
  });

  // Update event filters
  const updateEventFilters = (filters: Partial<Filter>) => {
    setEventFilters(prev => {
      const newFilters = { ...prev, ...filters };
      
      // Save to localStorage
      try {
        localStorage.setItem('eventFilters', JSON.stringify(newFilters));
      } catch (error) {
        console.error('Error saving event filters:', error);
      }
      
      return newFilters;
    });
  };

  // Update restaurant filters
  const updateRestaurantFilters = (filters: Partial<RestaurantFilter>) => {
    setRestaurantFilters(prev => {
      const newFilters = { ...prev, ...filters };
      
      // Save to localStorage
      try {
        localStorage.setItem('restaurantFilters', JSON.stringify(newFilters));
      } catch (error) {
        console.error('Error saving restaurant filters:', error);
      }
      
      return newFilters;
    });
  };

  // Reset filters
  const resetEventFilters = () => {
    setEventFilters(defaultEventFilters);
    
    // Remove from localStorage
    try {
      localStorage.removeItem('eventFilters');
    } catch (error) {
      console.error('Error removing event filters:', error);
    }
  };

  const resetRestaurantFilters = () => {
    setRestaurantFilters(defaultRestaurantFilters);
    
    // Remove from localStorage
    try {
      localStorage.removeItem('restaurantFilters');
    } catch (error) {
      console.error('Error removing restaurant filters:', error);
    }
  };

  const value = {
    eventFilters,
    restaurantFilters,
    updateEventFilters,
    updateRestaurantFilters,
    resetEventFilters,
    resetRestaurantFilters
  };

  return (
    <FiltersContext.Provider value={value}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFiltersContext() {
  const context = useContext(FiltersContext);
  
  if (context === undefined) {
    throw new Error('useFiltersContext must be used within a FiltersProvider');
  }
  
  return context;
}