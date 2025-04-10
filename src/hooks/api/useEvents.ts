import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi, EventsSearchParams } from '@/services/api/events';
import { Event } from '@/types';
import { toast } from 'sonner';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  search: (params: EventsSearchParams) => [...eventKeys.all, 'search', params] as const,
  detail: (id: string) => [...eventKeys.all, 'detail', id] as const,
  featured: (params: { latitude: number; longitude: number }) => 
    [...eventKeys.all, 'featured', params] as const,
  category: (category: string, params: { latitude: number; longitude: number }) => 
    [...eventKeys.all, 'category', category, params] as const,
  dateRange: (params: { latitude: number; longitude: number; startDate: string; endDate: string }) => 
    [...eventKeys.all, 'date-range', params] as const,
  saved: () => [...eventKeys.all, 'saved'] as const
};

// Hook for searching events
export function useEventsSearch(params: EventsSearchParams, options = {}) {
  return useQuery({
    queryKey: eventKeys.search(params),
    queryFn: () => eventsApi.searchEvents(params),
    enabled: Boolean(params.latitude && params.longitude),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

// Hook for getting event details
export function useEventDetails(id: string, options = {}) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getEvent(id),
    enabled: Boolean(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options
  });
}

// Hook for getting featured events
export function useFeaturedEvents(params: { latitude: number; longitude: number }, options = {}) {
  return useQuery({
    queryKey: eventKeys.featured(params),
    queryFn: () => eventsApi.getFeaturedEvents(params),
    enabled: Boolean(params.latitude && params.longitude),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options
  });
}

// Hook for getting events by category
export function useEventsByCategory(
  category: string, 
  params: { latitude: number; longitude: number },
  options = {}
) {
  return useQuery({
    queryKey: eventKeys.category(category, params),
    queryFn: () => eventsApi.getEventsByCategory(category, params),
    enabled: Boolean(category && params.latitude && params.longitude),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
}

// Hook for getting events by date range
export function useEventsByDateRange(
  params: { latitude: number; longitude: number; startDate: string; endDate: string },
  options = {}
) {
  return useQuery({
    queryKey: eventKeys.dateRange(params),
    queryFn: () => eventsApi.getEventsByDateRange(params),
    enabled: Boolean(params.latitude && params.longitude && params.startDate && params.endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
}

// Hook for getting saved events
export function useSavedEvents(options = {}) {
  return useQuery({
    queryKey: eventKeys.saved(),
    queryFn: () => eventsApi.getSavedEvents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
}

// Hook for saving an event
export function useSaveEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventId: string) => eventsApi.saveEvent(eventId),
    onSuccess: () => {
      // Invalidate saved events query to refetch
      queryClient.invalidateQueries({ queryKey: eventKeys.saved() });
      toast.success('Event saved successfully');
    },
    onError: (error) => {
      console.error('Error saving event:', error);
      toast.error('Failed to save event. Please try again.');
    }
  });
}

// Hook for removing a saved event
export function useRemoveSavedEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventId: string) => eventsApi.removeSavedEvent(eventId),
    onSuccess: () => {
      // Invalidate saved events query to refetch
      queryClient.invalidateQueries({ queryKey: eventKeys.saved() });
      toast.success('Event removed from saved list');
    },
    onError: (error) => {
      console.error('Error removing saved event:', error);
      toast.error('Failed to remove event. Please try again.');
    }
  });
}