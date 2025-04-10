import { Handler } from '@netlify/functions';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'real-time-events-search.p.rapidapi.com';

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

  if (!RAPIDAPI_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'RapidAPI key not configured' }) };
  }

  const { latitude, longitude, radius = '50', query = 'events' } = event.queryStringParameters || {};

  if (!latitude || !longitude) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Latitude and longitude are required' }) };
  }

  const searchUrl = `https://${RAPIDAPI_HOST}/search-events?query=${encodeURIComponent(query)}&lat=${latitude}&lon=${longitude}&radius=${radius}&unit=mi&date=any&is_virtual=false&start=0&size=100`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });

    if (!response.ok) {
      throw new Error(`RapidAPI error: ${response.status}`);
    }

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (error: unknown) {
    console.error('RapidAPI Proxy Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { statusCode: 500, headers, body: JSON.stringify({ error: errorMessage }) };
  }
};
