import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Star } from 'lucide-react';
import { Event } from '../types';
import { formatDistance } from '@/utils/distance';

// Default images for each category
const DEFAULT_IMAGES = {
  // Music categories
  'music': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'live-music': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'concert': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'band': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Comedy categories
  'comedy': 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'stand-up': 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Sports categories
  'sports': 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'sports-games': 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'baseball': 'https://images.unsplash.com/photo-1508344928928-7165b0c40ae6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'football': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'soccer': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'hockey': 'https://images.unsplash.com/photo-1580891034942-419a5c7f82ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Arts categories
  'arts': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'performing-arts': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'theatre': 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'theater': 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'dance': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'musical': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'opera': 'https://images.unsplash.com/photo-1522776203873-e4a8bef2a888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Food categories
  'food': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'food-drink': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'dining': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'festival': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Cultural categories
  'cultural': 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'museum': 'https://images.unsplash.com/photo-1565060169194-19fabf63eba8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'exhibition': 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'gallery': 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Social categories
  'social': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'networking': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'party': 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Educational categories
  'educational': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'workshop': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'conference': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'seminar': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'lecture': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Outdoor categories
  'outdoor': 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'hiking': 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'camping': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'adventure': 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Special categories
  'special': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'holiday': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'celebration': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  
  // Default image
  'default': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
};

// Function to get image URL based on event category
const getEventImage = (event: Event): string => {
  // First check if the event has an image URL
  if (event.imageUrl) return event.imageUrl;
  if (event.image) return event.image;
  
  // If no image URL, try to find a matching category
  if (event.category) {
    const categoryKey = Object.keys(DEFAULT_IMAGES).find(key => 
      event.category?.toLowerCase().includes(key.toLowerCase())
    );
    if (categoryKey) return DEFAULT_IMAGES[categoryKey as keyof typeof DEFAULT_IMAGES];
  }
  
  // If no category match, try to find a match in the categories array
  if (event.categories && event.categories.length > 0) {
    for (const category of event.categories) {
      const categoryKey = Object.keys(DEFAULT_IMAGES).find(key => 
        category.toLowerCase().includes(key.toLowerCase())
      );
      if (categoryKey) return DEFAULT_IMAGES[categoryKey as keyof typeof DEFAULT_IMAGES];
    }
  }
  
  // If no matches found, return the default image
  return DEFAULT_IMAGES.default;
};

// Get category icon
const getCategoryIcon = (category?: string): string => {
  if (!category) return '📍';
  
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('music') || categoryLower.includes('concert')) return '🎵';
  if (categoryLower.includes('comedy')) return '😄';
  if (categoryLower.includes('sport')) return '⚽';
  if (categoryLower.includes('art') || categoryLower.includes('theatre') || categoryLower.includes('theater')) return '🎭';
  if (categoryLower.includes('food') || categoryLower.includes('dining')) return '🍽️';
  if (categoryLower.includes('festival')) return '🎪';
  if (categoryLower.includes('film') || categoryLower.includes('movie')) return '🎬';
  if (categoryLower.includes('outdoor') || categoryLower.includes('adventure')) return '🌲';
  if (categoryLower.includes('education') || categoryLower.includes('workshop')) return '📚';
  
  return '📍';
};

interface EventCardProps {
  event: Event;
  onClick: () => void;
  isSelected?: boolean;
}

export default function EventCard({ event, onClick, isSelected }: EventCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Safely access nested properties
  const address = event.location?.address || 'Location TBA';
  const formattedDate = event.date || 'Date TBA';
  const categoryIcon = getCategoryIcon(event.category);
  
  // Format price if available
  const priceDisplay = event.price !== undefined && event.price !== null
    ? event.price === 0 
      ? 'Free'
      : `$${event.price}`
    : null;
    
  // Get venue details
  const venueName = event.venue_details?.name || event.venue || '';
  const venueRating = event.venue_details?.rating;

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl transition-all duration-300 
        ${isSelected 
          ? 'ring-2 ring-primaryToken-500 bg-bgToken-tertiary' 
          : 'hover:bg-bgToken-secondary'
        }
      `}
    >
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Image */}
        <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-bgToken-tertiary animate-pulse" />
          )}
          
          <img
            src={imageError ? DEFAULT_IMAGES.default : getEventImage(event)}
            alt={event.title}
            className={`
              w-full h-full object-cover transition-opacity duration-300
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
          
          <div className="absolute top-2 left-2 bg-bgToken-primary/80 backdrop-blur-sm 
                         text-textToken-primary px-2 py-1 rounded-md text-xs font-medium">
            {categoryIcon} {event.subcategory || event.category}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-textToken-primary line-clamp-2">{event.title}</h3>
          
          <div className="mt-2 space-y-1.5">
            {/* Date and Time */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primaryToken-400" />
              <span className="text-textToken-secondary">{formattedDate}</span>
              {event.time && (
                <>
                  <span className="text-textToken-tertiary">•</span>
                  <Clock className="w-4 h-4 text-primaryToken-400" />
                  <span className="text-textToken-secondary">{event.time}</span>
                </>
              )}
            </div>
            
            {/* Location */}
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-errorToken mt-0.5" />
              <div>
                <div className="text-textToken-secondary">{venueName}</div>
                <div className="text-textToken-tertiary text-xs line-clamp-1">
                  {address}
                </div>
              </div>
            </div>
            
            {/* Price and Rating */}
            <div className="flex items-center gap-4 text-sm">
              {priceDisplay && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-successToken" />
                  <span className="text-textToken-secondary">{priceDisplay}</span>
                </div>
              )}
              
              {venueRating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warningToken" />
                  <span className="text-textToken-secondary">{venueRating}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Distance */}
          {event.distance && (
            <div className="mt-auto pt-2">
              <span className="text-xs bg-primaryToken-500/10 text-primaryToken-400 px-2 py-1 rounded-md">
                {formatDistance(event.distance, event.distance > 1000)} away
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
            ? 'bg-successToken/20 text-successToken' 
            : 'bg-errorToken/20 text-errorToken'
          }
        `}>
          {event.status === 'open' ? 'Open' : 'Closed'}
        </div>
      )}
    </div>
  );
}
