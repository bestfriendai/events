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
  },
  
  // Get featured events
  async getFeaturedEvents(params: { latitude: number; longitude: number }) {
    return apiClient.get<Event[]>('/events/featured', {
      params
    });
  },
  
  // Get events by category
  async getEventsByCategory(category: string, params: { latitude: number; longitude: number }) {
    return apiClient.get<EventsResponse>(`/events/category/${category}`, {
      params
    });
  },
  
  // Get events by date range
  async getEventsByDateRange(params: { 
    latitude: number; 
    longitude: number;
    startDate: string;
    endDate: string;
  }) {
    return apiClient.get<EventsResponse>('/events/date-range', {
      params
    });
  },
  
  // Save an event (for logged-in users)
  async saveEvent(eventId: string) {
    return apiClient.post<{ success: boolean }>('/user/saved-events', { eventId });
  },
  
  // Remove a saved event
  async removeSavedEvent(eventId: string) {
    return apiClient.delete<{ success: boolean }>(`/user/saved-events/${eventId}`);
  },
  
  // Get saved events
  async getSavedEvents() {
    return apiClient.get<Event[]>('/user/saved-events');
  }
};