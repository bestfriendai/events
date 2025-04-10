import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';
import { Location } from '@/types';

interface LocationWithName extends Location {
  name?: string;
}

interface LocationContextType {
  userLocation: LocationWithName | null;
  searchLocation: LocationWithName | null;
  isLoading: boolean;
  error: string | null;
  setSearchLocation: (location: LocationWithName | null) => void;
  clearSearchLocation: () => void;
  refreshUserLocation: () => Promise<void>;
  activeLocation: LocationWithName | null; // The currently active location (search or user)
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [searchLocation, setSearchLocation] = useState<LocationWithName | null>(null);
  const { location: geoLocation, loading, permissionDenied, getLocation } = useGeolocation();
  const [userLocation, setUserLocation] = useState<LocationWithName | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update user location when geolocation changes
  useEffect(() => {
    if (geoLocation) {
      setUserLocation({
        ...geoLocation,
        name: 'Current Location'
      });
      
      // Clear error if we successfully got a location
      setError(null);
    } else if (permissionDenied) {
      setError('Location permission denied. Please enable location access in your browser settings.');
    }
  }, [geoLocation, permissionDenied]);

  // Refresh user location
  const refreshUserLocation = async () => {
    toast.loading('Finding your location...', { id: 'location-loading' });
    
    try {
      getLocation();
      
      // Wait for the location to be updated
      await new Promise<void>((resolve) => {
        const checkLocation = () => {
          if (!loading) {
            resolve();
          } else {
            setTimeout(checkLocation, 100);
          }
        };
        checkLocation();
      });
      
      if (geoLocation) {
        toast.success('Location found!', { id: 'location-loading' });
      } else if (permissionDenied) {
        toast.error('Location permission denied. Please enable location access in your browser settings.', { id: 'location-loading' });
        setError('Location permission denied. Please enable location access in your browser settings.');
      } else if (geoLocation?.error) {
        toast.error(geoLocation.error, { id: 'location-loading' });
        setError(geoLocation.error);
      } else {
        toast.error('Could not determine your location. Please try again or enter a location manually.', { id: 'location-loading' });
        setError('Could not determine your location. Please try again or enter a location manually.');
      }
    } catch (error) {
      console.error('Failed to refresh user location:', error);
      toast.error('Could not determine your location. Please try again or enter a location manually.', { id: 'location-loading' });
      setError('Could not determine your location. Please try again or enter a location manually.');
    }
  };

  // Clear search location
  const clearSearchLocation = () => {
    setSearchLocation(null);
  };

  // Determine the active location (search location takes precedence over user location)
  const activeLocation = searchLocation || userLocation;

  // Initial location detection
  useEffect(() => {
    // Only attempt to get location if we don't already have one
    if (!userLocation && !loading && !permissionDenied) {
      refreshUserLocation();
    }
  }, []);

  const value = {
    userLocation,
    searchLocation,
    isLoading: loading,
    error,
    setSearchLocation,
    clearSearchLocation,
    refreshUserLocation,
    activeLocation
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