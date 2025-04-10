import { Handler } from '@netlify/functions';

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const BASE_URL = 'https://serpapi.com/search.json';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (!SERPAPI_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'SerpAPI key not configured' }) };
  }

  const { latitude, longitude, q = 'events', hl = 'en', gl = 'us', num = '20' } = event.queryStringParameters || {};

  if (!latitude || !longitude) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Latitude and longitude are required' }) };
  }

  const searchParams = new URLSearchParams({
    engine: 'google_events',
    q,
    hl,
    gl,
    api_key: SERPAPI_KEY,
    location: `${latitude},${longitude}`,
    device: 'desktop',
    num
  });

  const searchUrl = `${BASE_URL}?${searchParams.toString()}`;

  try {
    const response = await fetch(searchUrl);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('SerpAPI Error Response:', errorBody);
      throw new Error(`SerpAPI error: ${response.status}`);
    }

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (error: unknown) {
    console.error('Google Proxy Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { statusCode: 500, headers, body: JSON.stringify({ error: errorMessage }) };
  }
};
