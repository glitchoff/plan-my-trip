import { tool } from 'ai';
import { z } from 'zod';

export const getTodayDate = tool({
    description: 'Get today\'s date',
    inputSchema: z.object({}),
    execute: async () => {
        try {
            console.log(`🤖 Getting today's date`);
            const today = new Date().toISOString().split('T')[0];
            return today;
        } catch (error) {
            console.error('Error in getting today\'s date:', error);
            return { error: 'Failed to get today\'s date' };
        }
    },
});



export const calendarTools = {
    getTodayDate,
};