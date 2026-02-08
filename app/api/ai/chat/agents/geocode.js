import { tool } from 'ai';
import { z } from 'zod';
import { geocodeSearch, reverseGeocode } from '@/app/lib/geocode-api';

export const getCoordinates = tool({
    description: 'Get coordinates (latitude/longitude) for a specific address or place',
    inputSchema: z.object({
        address: z.string().describe('The address or place name to geocode (e.g., "Taj Mahal, Agra")'),
    }),
    execute: async ({ address }) => {
        try {
            console.log(`🤖 Geocoding address: ${address}`);
            const result = await geocodeSearch(address, 1);

            if (!result.features || result.features.length === 0) {
                return { error: 'Location not found' };
            }

            const location = result.features[0].properties;
            return {
                formatted_address: location.formatted,
                lat: location.lat,
                lon: location.lon,
                city: location.city,
                state: location.state,
                country: location.country
            };

        } catch (error) {
            console.error('Geocoding error:', error);
            return { error: 'Failed to geocode address' };
        }
    },
});

export const getLocationDetails = tool({
    description: 'Get address details from latitude and longitude',
    inputSchema: z.object({
        lat: z.number().describe('Latitude'),
        lon: z.number().describe('Longitude'),
    }),
    execute: async ({ lat, lon }) => {
        try {
            console.log(`🤖 Reverse geocoding: ${lat}, ${lon}`);
            const result = await reverseGeocode(lat, lon);

            if (!result.features || result.features.length === 0) {
                return { error: 'Location details not found' };
            }

            const location = result.features[0].properties;
            return {
                formatted_address: location.formatted,
                city: location.city,
                state: location.state,
                postcode: location.postcode
            };

        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return { error: 'Failed to get location details' };
        }
    },
});
