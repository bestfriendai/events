import { useState, useEffect, useCallback } from 'react';

/**
 * A hook for managing state that persists in localStorage
 * 
 * @param key The localStorage key to store the value under
 * @param initialValue The initial value to use if no value is found in localStorage
 * @param options Additional options for customizing behavior
 * @returns A stateful value and a function to update it
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    syncWithOtherTabs?: boolean;
  } = {}
) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncWithOtherTabs = true
  } = options;

  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserialize]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      // Prevent build error "window is undefined" but keep working
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a client`
        );
      }

      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save to local state
        setStoredValue(valueToStore);

        // Save to local storage
        window.localStorage.setItem(key, serialize(valueToStore));

        // Dispatch a custom event so other tabs can update
        if (syncWithOtherTabs) {
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              newValue: serialize(valueToStore),
            })
          );
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue, syncWithOtherTabs]
  );

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    if (!syncWithOtherTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(deserialize(e.newValue));
        } catch (error) {
          console.warn(
            `Error parsing localStorage change for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize, syncWithOtherTabs]);

  // Additional methods for convenience
  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      
      // Notify other tabs
      if (syncWithOtherTabs) {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: null,
          })
        );
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, syncWithOtherTabs]);

  const clear = useCallback(() => {
    try {
      window.localStorage.clear();
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error clearing localStorage:`, error);
    }
  }, [initialValue]);

  return {
    value: storedValue,
    setValue,
    remove,
    clear,
  };
}