import { Handler } from '@netlify/functions';

const EVENTBRITE_PRIVATE_TOKEN = process.env.EVENTBRITE_PRIVATE_TOKEN;

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

  if (!EVENTBRITE_PRIVATE_TOKEN) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Eventbrite token not configured' }) };
  }

  const { latitude, longitude, radius = '100mi', start_date_range_start } = event.queryStringParameters || {};

  if (!latitude || !longitude) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Latitude and longitude are required' }) };
  }

  const today = new Date().toISOString().split('T')[0];
  const startDate = start_date_range_start || `${today}T00:00:00`;

  const searchUrl = `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${latitude}&location.longitude=${longitude}&location.within=${radius}&start_date.range_start=${startDate}&expand=venue,ticket_availability,category`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Eventbrite API error: ${response.status}`);
    }

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (error: unknown) {
    console.error('Eventbrite Proxy Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { statusCode: 500, headers, body: JSON.stringify({ error: errorMessage }) };
  }
};
