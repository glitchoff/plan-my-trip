import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import { z } from 'zod';

const nim = createOpenAICompatible({
    name: 'nim',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    headers: {
        Authorization: `Bearer ${process.env.NIM_API_KEY}`,
    },
});

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        const RAILRADAR_API_KEY = process.env.RAILRADAR_API;

        if (!RAILRADAR_API_KEY) {
            return Response.json({ error: 'RailRadar API key not configured' }, { status: 500 });
        }

        // Use generateText with tools and maxSteps
        const result = await generateText({
            model: nim.chatModel('meta/llama-3.1-70b-instruct'),
            system: `You are a railway station search assistant.
When the user provides a location name:
1. Use the searchStations tool to find matching stations
2. Return ONLY a valid JSON object with the results
3. Format: { "stations": [...] }
4. No markdown, no explanation, just the JSON object`,
            prompt: prompt,
            maxSteps: 5,
            tools: {
                searchStations: {
                    description: 'Search for railway stations by name or code',
                    inputSchema: z.object({
                        query: z.string().describe('The name or code of the station to search for'),
                    }),
                    execute: async ({ query }) => {
                        console.log(`Searching stations for: ${query}`);

                        try {
                            const url = `https://api.railradar.org/api/v1/search/stations?query=${encodeURIComponent(query)}`;
                            const response = await fetch(url, {
                                headers: {
                                    'Accept': 'application/json',
                                    'x-api-key': RAILRADAR_API_KEY,
                                },
                            });

                            if (!response.ok) {
                                return { error: `API Error: ${response.status}`, stations: [] };
                            }

                            const data = await response.json();
                            const stations = data.data?.stations || data.stations || [];
                            console.log(`Found ${stations.length} stations`);
                            return { stations };
                        } catch (error) {
                            console.error('RailRadar Search Error:', error);
                            return { error: error.message, stations: [] };
                        }
                    },
                },
            },
        });

        // The result.text should contain the final response after tool execution
        console.log('AI Response:', result.text);

        // Parse the response
        try {
            const cleanText = result.text.replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            return Response.json(parsed);
        } catch (e) {
            console.warn('Failed to parse JSON:', result.text);
            
            // If tool was called, check toolResults
            if (result.toolResults && result.toolResults.length > 0) {
                const toolResult = result.toolResults[0].result;
                return Response.json({ stations: toolResult.stations || [] });
            }
            
            return Response.json({ stations: [], raw: result.text });
        }

    } catch (error) {
        console.error('AI Route Error:', error);
        return Response.json({ 
            error: 'Failed to process request', 
            details: error.message 
        }, { status: 500 });
    }
}