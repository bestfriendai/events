# API Testing Guide for EventMap Magic

This guide explains how to test the API integrations used in the EventMap Magic application.

## Prerequisites

1. Make sure you have all required API keys set up in your `.env.local` file.
2. Copy the keys from `.env.example` and replace with your actual API keys.

## Running API Tests

The application includes a comprehensive API testing utility that can test all API integrations at once.

### Using npm scripts

We've added several npm scripts to make testing easier:

```bash
# Test with default location (San Francisco)
npm run test:apis

# Test with San Francisco coordinates
npm run test:apis:sf

# Test with New York coordinates
npm run test:apis:nyc

# Test with custom location
npm run test:apis -- --name="Chicago" --location=41.8781,-87.6298 --radius=15
```

### Test Script Options

The test script accepts the following command-line arguments:

- `--location=lat,lng`: Specify the latitude and longitude to use for testing
- `--name=LocationName`: Specify the name of the location (for display purposes)
- `--radius=10`: Specify the search radius in miles (default: 10)

### Example

```bash
node scripts/test-apis.js --name="Los Angeles" --location=34.0522,-118.2437 --radius=20
```

## API Integration Details

The application integrates with the following APIs:

1. **Mapbox API**: Used for geocoding (converting location names to coordinates)
2. **Ticketmaster API**: Used to fetch events from Ticketmaster
3. **Eventbrite API**: Used to fetch events from Eventbrite
4. **RapidAPI Events**: Used to fetch events from various sources via RapidAPI
5. **Google Events (SerpAPI)**: Used to fetch events from Google via SerpAPI

## Troubleshooting

If you encounter issues with the API tests:

1. **Check your API keys**: Make sure all required API keys are correctly set in your `.env.local` file
2. **Check API quotas**: Some APIs have usage limits that might be exceeded
3. **Check network connectivity**: Make sure you have internet access
4. **CORS issues**: The application uses CORS proxies to handle CORS restrictions, which might sometimes fail

## Using the API Tester Component

The application also includes a visual API tester component that you can use to test individual APIs:

1. Navigate to `/api-test` in the application
2. Enter a location to search
3. Select the API you want to test
4. Click "Test API" to see the results

This can be helpful for debugging specific API issues in a more visual way.
