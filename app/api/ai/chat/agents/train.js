import { tool } from 'ai';
import { z } from 'zod';
import { getTrainsBetweenStations, getTrainsOnDate, getTrainRoute } from '@/app/lib/train-api';

export const searchTrains = tool({
    description: 'Search for trains between two stations, optionally on a specific date',
    inputSchema: z.object({
        from: z.string().describe('Source station code (e.g., "NDLS", "CSMT")'),
        to: z.string().describe('Destination station code (e.g., "BCT", "HWH")'),
        date: z.string().optional().describe('Date of travel in DD-MM-YYYY format (e.g., "25-03-2024")'),
    }),
    execute: async ({ from, to, date }) => {
        try {
            console.log(`🤖 Searching trains from ${from} to ${to} on ${date || 'any date'}`);

            let result;
            if (date) {
                result = await getTrainsOnDate(from, to, date);
            } else {
                result = await getTrainsBetweenStations(from, to);
            }

            if (!result.success) {
                return { error: result.data || 'No trains found' };
            }

            // Summarize results to avoid context limit issues
            // train_base structure: 
            // { train_no, train_name, source_stn_name, dstn_stn_name, from_time, to_time, travel_time, running_days }

            const trains = result.data.map(item => {
                const t = item.train_base;
                return {
                    number: t.train_no,
                    name: t.train_name,
                    departure: t.from_time,
                    arrival: t.to_time,
                    duration: t.travel_time,
                    days: t.running_days
                };
            }).slice(0, 10); // Limit to top 10

            return {
                totalDetails: `Found ${result.data.length} trains`,
                trains: trains
            };

        } catch (error) {
            console.error('Train search error:', error);
            return { error: 'Failed to search trains' };
        }
    },
});

export const getTrainRouteDetails = tool({
    description: 'Get the route schedule and details for a specific train',
    inputSchema: z.object({
        trainNo: z.string().describe('The train number (e.g., "12951")'),
    }),
    execute: async ({ trainNo }) => {
        try {
            console.log(`🤖 Getting route for train: ${trainNo}`);
            const result = await getTrainRoute(trainNo);

            if (!result.success) {
                return { error: result.data || 'Train route not found' };
            }

            // Summarize route
            // route object: { source_stn_name, source_stn_code, arrive, depart, distance, day }
            const route = result.data.map(stop => ({
                station: stop.source_stn_name,
                code: stop.source_stn_code,
                arrive: stop.arrive,
                depart: stop.depart,
                day: stop.day
            }));

            return {
                trainNo: trainNo,
                stops: route
            };

        } catch (error) {
            console.error('Train route error:', error);
            return { error: 'Failed to fetch train route' };
        }
    },
});
