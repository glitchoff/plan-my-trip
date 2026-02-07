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
        const body = await req.json();
        const { source, destination, fromLat, fromLon, toLat, toLon } = body;

        const RAILRADAR_API_KEY = process.env.RAILRADAR_API;

        if (!RAILRADAR_API_KEY) {
            return Response.json({ error: 'RailRadar API key not configured' }, { status: 500 });
        }

        console.log('Searching stations:', { source, destination });

        // Use generateText with tools
        const result = await generateText({
            model: nim.chatModel('meta/llama-3.1-70b-instruct'),
            system: `You are a railway station search assistant.
You will receive source and destination location names.
Use the searchStations tool to find railway stations near both locations.
Return ONLY a valid JSON object in this exact format:
{
  "sourceStations": [...],
  "destinationStations": [...]
}
No markdown formatting, no explanations, just the JSON.`,
            prompt: `Find railway stations for:
Source: ${source}
Destination: ${destination}

Search for stations near both locations and return the results.`,
            maxSteps: 10,
            tools: {
                searchStations: {
                    description: 'Search for railway stations by name, code, or location',
                    inputSchema: z.object({
                        query: z.string().describe('The location name to search for stations'),
                    }),
                    execute: async ({ query }) => {
                        console.log(`🔍 Searching stations for: ${query}`);

                        try {
                            const url = `https://api.railradar.org/api/v1/search/stations?query=${encodeURIComponent(query)}`;
                            const response = await fetch(url, {
                                headers: {
                                    'Accept': 'application/json',
                                    'x-api-key': RAILRADAR_API_KEY,
                                },
                            });

                            if (!response.ok) {
                                console.error(`❌ API Error: ${response.status}`);
                                return { stations: [], error: `API returned ${response.status}` };
                            }

                            const data = await response.json();
                            const stations = data.data?.stations || data.stations || [];
                            
                            console.log(`✅ Found ${stations.length} stations for "${query}"`);
                            
                            return { 
                                stations: stations.map(s => ({
                                    code: s.code,
                                    name: s.name,
                                    state: s.state,
                                    lat: s.lat,
                                    lon: s.lon
                                }))
                            };
                        } catch (error) {
                            console.error('❌ RailRadar Error:', error);
                            return { stations: [], error: error.message };
                        }
                    },
                },
            },
        });

        console.log('🤖 AI Response:', result.text);

        // Parse the final response
        try {
            // Remove any markdown code blocks
            let cleanText = result.text.trim();
            cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
            
            const parsed = JSON.parse(cleanText);
            
            return Response.json({
                sourceStations: parsed.sourceStations || [],
                destinationStations: parsed.destinationStations || [],
            });
        } catch (parseError) {
            console.error('⚠️ JSON Parse Error:', parseError);
            console.error('Raw text:', result.text);
            
            // Fallback: check if we have tool results
            if (result.toolResults && result.toolResults.length > 0) {
                console.log('📦 Using tool results directly');
                const sourceResult = result.toolResults.find(r => 
                    r.toolName === 'searchStations' && 
                    r.args.query.toLowerCase().includes(source.split(',')[0].toLowerCase())
                );
                const destResult = result.toolResults.find(r => 
                    r.toolName === 'searchStations' && 
                    r.args.query.toLowerCase().includes(destination.split(',')[0].toLowerCase())
                );

                return Response.json({
                    sourceStations: sourceResult?.result?.stations || [],
                    destinationStations: destResult?.result?.stations || [],
                });
            }

            return Response.json({ 
                error: 'Failed to parse AI response',
                sourceStations: [],
                destinationStations: [],
                debug: result.text
            });
        }

    } catch (error) {
        console.error('💥 Route Error:', error);
        return Response.json({ 
            error: 'Failed to process request', 
            details: error.message,
            sourceStations: [],
            destinationStations: []
        }, { status: 500 });
    }
}