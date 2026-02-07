import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const BASE_URL = 'https://test.api.amadeus.com'; // Use test environment for free tier

// Simple in-memory cache for token (Note: This resets on server restart/re-deploy)
let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpiry) {
        return cachedToken;
    }

    try {
        const res = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
        });

        const data = await res.json();

        if (data.access_token) {
            cachedToken = data.access_token;
            // Set expiry slightly before actual expiry (e.g., 5 mins buffer)
            tokenExpiry = now + (data.expires_in * 1000) - 300000;
            return cachedToken;
        } else {
            throw new Error('Failed to retrieve access token');
        }
    } catch (error) {
        console.error('Amadeus Auth Error:', error);
        throw error;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    try {
        const token = await getAccessToken();

        if (action === 'searchAirports') {
            const query = searchParams.get('query');
            if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });

            // https://developers.amadeus.com/self-service/category/air/api-doc/airport-and-city-search/api-reference
            const url = `${BASE_URL}/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${encodeURIComponent(query)}&page[limit]=10`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            return NextResponse.json(data);

        } else if (action === 'searchFlights') {
            const origin = searchParams.get('origin');
            const destination = searchParams.get('destination');
            const date = searchParams.get('date');

            if (!origin || !destination || !date) {
                return NextResponse.json({ error: 'Origin, Destination, and Date required' }, { status: 400 });
            }

            // https://developers.amadeus.com/self-service/category/air/api-doc/flight-offers-search/api-reference
            const url = `${BASE_URL}/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1&nonStop=false&max=20`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Amadeus API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
