import { tool } from 'ai';
import { z } from 'zod';
import { searchBusCities, searchBusRoutes } from '@/app/lib/bus-api';

export const searchCity = tool({
    description: 'Search for cities in the bus database to get their IDs',
    inputSchema: z.object({
        query: z.string().describe('The city name to search for (e.g., "Hyderabad")'),
    }),
    execute: async ({ query }) => {
        try {
            console.log(`🤖 Searching bus cities for: ${query}`);
            const results = await searchBusCities(query);
            return results.slice(0, 5); // Limit to top 5 result
        } catch (error) {
            console.error('Bus city search error:', error);
            return { error: 'Failed to search cities' };
        }
    },
});

export const getBusRoutes = tool({
    description: 'Search for available bus routes between two cities for a specific date',
    inputSchema: z.object({
        fromCityId: z.string().describe('The ID of the source city (obtained from searchCity tool)'),
        toCityId: z.string().describe('The ID of the destination city (obtained from searchCity tool)'),
        date: z.string().describe('Date of travel in YYYY-MM-DD format (e.g., "2024-03-25")'),
        fromCityName: z.string().optional().describe('Name of the source city'),
        toCityName: z.string().optional().describe('Name of the destination city'),
    }),
    execute: async ({ fromCityId, toCityId, date, fromCityName, toCityName }) => {
        try {
            console.log(`🤖 Searching buses from ${fromCityName}(${fromCityId}) to ${toCityName}(${toCityId}) on ${date}`);
            const result = await searchBusRoutes(fromCityId, toCityId, date, fromCityName, toCityName);

            if (!result.success) {
                return { error: result.error || 'No buses found' };
            }

            // Return a summarized list of buses to avoid context limit issues
            return {
                totalBuses: result.totalBuses,
                route: result.route,
                buses: result.buses.slice(0, 10).map(bus => ({
                    operator: bus.operatorName,
                    type: bus.busType,
                    departure: bus.departure.time,
                    arrival: bus.arrival.time,
                    price: bus.pricing.finalPrice,
                    seats: bus.availableSeats,
                    rating: bus.rating.score
                }))
            };
        } catch (error) {
            console.error('Bus route search error:', error);
            return { error: 'Failed to fetch bus routes' };
        }
    },
});
