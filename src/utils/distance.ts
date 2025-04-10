// Calculate distance between two points using the Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format a distance value for display
 * @param meters Distance in meters or miles
 * @param isMeters Whether the distance is in meters (true) or miles (false)
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, isMeters: boolean = true): string {
  if (isMeters) {
    // Convert meters to miles
    const miles = distance / 1609.34;
    return miles < 10 ? `${miles.toFixed(1)} miles` : `${Math.round(miles)} miles`;
  } else {
    // Already in miles
    return distance < 10 ? `${distance.toFixed(1)} miles` : `${Math.round(distance)} miles`;
  }
}