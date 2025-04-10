import { Message } from '../types/chat';
import { Event } from '../types';
import { searchLocations } from './mapbox';
import { validateMessages } from './ai-validator';
import { aiMonitor } from './ai-monitor';

const CLAUDE_MODEL = 'anthropic/claude-3-sonnet-20240229';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const MAX_TOKENS = 4096;

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class RateLimiter {
  private lastRequest: number = 0;
  private minDelay: number = 500; // 500ms minimum delay between requests

  async waitIfNeeded() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minDelay - timeSinceLastRequest)
      );
    }
    
    this.lastRequest = Date.now();
  }
}

const rateLimiter = new RateLimiter();

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      const delay = RETRY_DELAY * Math.pow(2, i);
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('All retry attempts failed');
}

export async function getChatCompletion(messages: Message[]) {
  const messageValidation = validateMessages(messages);
  if (!messageValidation.isValid) {
    throw new Error(messageValidation.error);
  }

  const startTime = aiMonitor.startRequest('claude');

  try {
    await rateLimiter.waitIfNeeded();

    const response = await retryWithExponentialBackoff<OpenRouterResponse>(async () => {
      const result = await fetch('/.netlify/functions/openrouter-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: MAX_TOKENS,
          presence_penalty: 0.6,
          frequency_penalty: 0.5,
          stream: false,
          system: `You are an AI assistant helping users plan dates and find events. 
          When events are mentioned in your responses, format them like this:

          EVENT_START
          Title: [Event Title]
          Date: [Event Date in MM/DD/YYYY format]
          Time: [Event Time in HH:MM AM/PM format]
          Location: [Full address including venue name, street, city, state]
          Category: [One of: live-music, comedy, sports-games, performing-arts, food-drink, cultural, social, educational, outdoor, special]
          Price: [Price or price range if available]
          Description: [Brief description]
          EVENT_END`
        })
      });

      if (!result.ok) {
        const errorText = await result.text();
        throw new Error(`OpenRouter API error: ${result.status} - ${errorText}`);
      }

      return await result.json();
    });

    const events = await extractEventsFromResponse(response.choices[0].message.content);
    
    console.log('Claude API Usage:', {
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens,
      finishReason: response.choices[0].finish_reason,
      eventsExtracted: events.length
    });

    aiMonitor.endRequest('claude', startTime, true);

    return {
      content: response.choices[0].message.content,
      events,
      usage: response.usage
    };
  } catch (error) {
    aiMonitor.endRequest('claude', startTime, false, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

const EVENT_ICONS: Record<string, string> = {
  'live-music': '🎵',
  'comedy': '🎭',
  'sports-games': '⚽',
  'performing-arts': '🎪',
  'food-drink': '🍽️',
  'cultural': '🏛️',
  'social': '👥',
  'educational': '📚',
  'outdoor': '🌲',
  'special': '✨'
};

async function extractEventsFromResponse(content: string): Promise<Event[]> {
  const events: Event[] = [];
  const eventRegex = /EVENT_START\n([\s\S]*?)EVENT_END/g;
  const matches = content.matchAll(eventRegex);

  for (const match of matches) {
    try {
      const eventText = match[1];
      const event: Partial<Event> = {
        id: `ai-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        category: 'special',
        source: 'claude'
      };

      // Extract event details with improved parsing
      const fields = {
        Title: (value: string) => event.title = value.trim(),
        Date: (value: string) => {
          try {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              throw new Error('Invalid date');
            }
            event.date = date.toLocaleDateString();
          } catch {
            event.date = value.trim();
          }
        },
        Time: (value: string) => {
          const time = value.match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i)?.[0];
          event.time = time || value.trim();
        },
        Location: (value: string) => event.location = { 
          address: value.trim(), 
          latitude: 0, 
          longitude: 0 
        },
        Category: (value: string) => {
          const category = value.toLowerCase().trim();
          if (Object.keys(EVENT_ICONS).includes(category)) {
            event.category = category;
          }
        },
        Price: (value: string) => event.priceRange = value.trim(),
        Description: (value: string) => event.description = value.trim()
      };

      // Parse each field with error handling
      for (const [field, setter] of Object.entries(fields)) {
        try {
          const regex = new RegExp(`${field}:\\s*(.+)(?:\\n|$)`, 'i');
          const match = eventText.match(regex);
          if (match?.[1]) {
            setter(match[1]);
          }
        } catch (error) {
          console.error(`Error parsing ${field}:`, error);
        }
      }

      // Validate required fields
      if (event.title && event.location?.address) {
        try {
          // Get coordinates and additional venue info
          const suggestions = await searchLocations(event.location.address);
          if (suggestions.length > 0) {
            const [longitude, latitude] = suggestions[0].center;
            event.location = {
              ...event.location,
              latitude,
              longitude
            };
            
            // Extract venue details from suggestion
            const addressParts = suggestions[0].place_name.split(',');
            const venueName = event.location.address.split(',')[0].trim();
            event.venue = venueName;
            event.venue_details = {
              name: venueName,
              city: addressParts[1]?.trim() || '',
              state: addressParts[2]?.trim() || '',
              generalInfo: `Located in ${addressParts[1]?.trim() || 'the area'}`
            };

            // Set latitude and longitude at the top level too
            event.latitude = latitude;
            event.longitude = longitude;
            
            // Add categories array if not present
            if (!event.categories) {
              event.categories = event.category ? [event.category] : ['special'];
            }

            events.push(event as Event);
          }
        } catch (error) {
          console.error('Error getting location coordinates:', error);
        }
      }
    } catch (error) {
      console.error('Error processing event:', error);
    }
  }

  return events;
}