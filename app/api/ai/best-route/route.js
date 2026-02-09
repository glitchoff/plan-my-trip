import { generateText, Output } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { z } from 'zod';

// Config for NVIDIA NIM
const nim = createOpenAICompatible({
    name: 'nim',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    headers: {
        Authorization: `Bearer ${process.env.NIM_API_KEY}`,
    },
});

export const maxDuration = 60; // Allow longer timeout for reasoning

export async function POST(req) {
    try {
        const { source, destination, date } = await req.json();

        if (!source || !destination) {
            return Response.json({ error: "Source and Destination are required" }, { status: 400 });
        }

        const prompt = `Plan the best multi-modal travel route from ${source} to ${destination} for travel on ${date || "tomorrow"}.
        
        You MUST return a valid JSON object with the following structure:
        {
            "title": "Trip Title",
            "summary": "Brief summary",
            "itineraries": [
                {
                    "type": "Fastest",
                    "total_time": "5h 30m",
                    "total_cost": "INR 5000",
                    "segments": [
                        { "from": "A", "to": "B", "mode": "Cab", "departure": "10:00", "arrival": "10:30", "duration": "30m", "notes": "Details" }
                    ]
                }
            ]
        }
        
        Provide EXACTLY 2 distinct route options in the 'itineraries' array:
        1. "Fastest" (Prioritize speed)
        2. "Budget" (Prioritize cost)
        
        For each route, break it down into logical segments (Cab -> Train -> Bus).
        Be specific with Train Names and prices.
        `;

        const { output } = await generateText({
            model: nim.chatModel("openai/gpt-oss-120b"),
            prompt: prompt,
            output: Output.object({
                schema: z.object({
                    title: z.string().optional(),
                    summary: z.string().optional(),
                    itineraries: z.array(z.object({
                        type: z.string(),
                        focus: z.string().optional(),
                        total_time: z.string(),
                        total_cost: z.string().optional(),
                        comfort: z.string().optional(),
                        segments: z.array(z.object({
                            from: z.string(),
                            to: z.string(),
                            mode: z.string(),
                            departure: z.string(),
                            arrival: z.string(),
                            duration: z.string(),
                            notes: z.string(),
                            cost: z.string().optional()
                        }))
                    })),
                    general_tips: z.array(z.string()).optional()
                })
            })
        });

        // Map the AI's "itineraries" structure to the Frontend's "routes" structure
        const mappedRoutes = output.itineraries.map((itinerary, index) => {
            // Helper to clean cost string (e.g. "₹500" -> 500)
            const parseCost = (str) => {
                if (!str) return 0;
                const num = parseInt(str.replace(/[^0-9]/g, ''));
                return isNaN(num) ? 0 : num;
            };

            return {
                id: `ai-route-${index}`,
                name: itinerary.type,
                totalDuration: itinerary.total_time,
                totalPrice: parseCost(itinerary.total_cost || "0"),
                tags: [itinerary.focus, itinerary.comfort].filter(Boolean),
                segments: itinerary.segments.map(seg => ({
                    type: seg.mode.toLowerCase().includes('flight') ? 'flight' :
                        seg.mode.toLowerCase().includes('train') ? 'train' :
                            seg.mode.toLowerCase().includes('bus') ? 'bus' :
                                seg.mode.toLowerCase().includes('cab') ? 'cab' : 'auto',
                    from: seg.from,
                    to: seg.to,
                    startTime: seg.departure,
                    endTime: seg.arrival,
                    duration: seg.duration,
                    details: seg.notes,
                    price: parseCost(seg.cost)
                }))
            };
        });

        return Response.json({ routes: mappedRoutes, summary: output.summary, tips: output.general_tips });

    } catch (error) {
        console.error("AI Route Generation Error:", error);
        return Response.json({ error: "Failed to generate route", details: error.message }, { status: 500 });
    }
}
