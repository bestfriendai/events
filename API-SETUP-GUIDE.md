# API Setup Guide for EventMap Magic

This guide explains how to set up and troubleshoot the API integrations used in the EventMap Magic application.

## Required API Keys

The application uses several third-party APIs to fetch event data. Here's how to set up each one:

### 1. Mapbox API (Required)

Mapbox is used for geocoding and map display.

1. Go to [Mapbox](https://account.mapbox.com/) and create an account
2. Navigate to your account dashboard
3. Create a new access token or use the default public token
4. Add to your `.env.local` file: `VITE_MAPBOX_TOKEN=your_token_here`

### 2. Ticketmaster API (Required)

Ticketmaster is the primary source of event data.

1. Go to [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
2. Create an account and register a new application
3. Get your Consumer Key (API Key)
4. Add to your `.env.local` file: `VITE_TICKETMASTER_KEY=your_key_here`

### 3. Eventbrite API (Optional)

Eventbrite provides additional event data.

1. Go to [Eventbrite Developer Portal](https://www.eventbrite.com/platform/api)
2. Create an account and create a new application
3. Get your Private Token
4. Add to your `.env.local` file: `VITE_EVENTBRITE_PRIVATE_TOKEN=your_token_here`

### 4. RapidAPI Key (Optional)

RapidAPI is used to access the Real-Time Events Search API.

1. Go to [RapidAPI](https://rapidapi.com/)
2. Create an account
3. Subscribe to the [Real-Time Events Search API](https://rapidapi.com/real-time-events-search-api)
4. Get your API Key
5. Add to your `.env.local` file: `VITE_RAPIDAPI_KEY=your_key_here`

### 5. SerpAPI Key (Optional)

SerpAPI is used to fetch events from Google.

1. Go to [SerpAPI](https://serpapi.com/)
2. Create an account
3. Get your API Key
4. Add to your `.env.local` file: `VITE_SERPAPI_KEY=your_key_here`

## Setting Up Your Environment

1. Copy the `.env.local.example` file to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit the `.env.local` file and replace the placeholder values with your actual API keys.

3. Restart the application:
   ```bash
   npm run dev
   ```

## Troubleshooting API Issues

### Common Issues

1. **CORS Errors**: The application uses CORS proxies to handle CORS restrictions. If you see CORS errors:
   - Check that the CORS proxy is working
   - Try using a different CORS proxy
   - Consider setting up your own CORS proxy server

2. **API Key Issues**: If an API is not working:
   - Verify that your API key is correct
   - Check if your API key has the necessary permissions
   - Check if you've reached API usage limits

3. **Rate Limiting**: Many APIs have rate limits:
   - Ticketmaster: 5,000 calls per day
   - Eventbrite: Varies by plan
   - RapidAPI: Depends on your subscription
   - SerpAPI: Depends on your plan

### Using the API Tester

The application includes an API tester to help diagnose issues:

1. Navigate to `/api-test` in the application
2. Enter a location to search
3. Select the API you want to test
4. Click "Test API" to see the results

The API tester will show:
- The API response status
- The raw API response data
- Any errors that occur

### Checking API Key Status

You can check the status of your API keys in the browser console:

1. Open the browser developer tools (F12 or Ctrl+Shift+I)
2. Go to the Console tab
3. Look for "API Key Status" log entries

## Advanced Configuration

### Custom CORS Proxies

If the default CORS proxies are not working, you can modify the `CORS_PROXIES` array in `src/services/mapbox.ts`:

```typescript
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/'
];
```

Add your preferred CORS proxy to the beginning of the array.

### API Timeout Configuration

You can adjust the API timeout values in each service file:

- `src/services/ticketmaster.ts`: `REQUEST_TIMEOUT`
- `src/services/eventbrite-rapidapi.ts`: `REQUEST_TIMEOUT`
- `src/services/rapidapi-events.ts`: `REQUEST_TIMEOUT`

Increase these values if you're experiencing timeout issues.
