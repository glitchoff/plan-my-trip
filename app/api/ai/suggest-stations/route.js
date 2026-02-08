import { generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const nim = createOpenAICompatible({
    name: 'nim',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    headers: {
        Authorization: `Bearer ${process.env.NIM_API_KEY}`,
    },
});

export const maxDuration = 15;

export async function POST(req) {
    try {
        const { 
            sourceQuery, 
            destinationQuery, 
            fromLat, 
            fromLon, 
            toLat, 
            toLon, 
            fromAlternatives, 
            toAlternatives 
        } = await req.json();

        // Build prompt with user intent and alternatives
        const prompt = `You are a travel assistant helping users select the correct bus stations.

User's search intent:
- From: "${sourceQuery}" (coordinates: ${fromLat}, ${fromLon})
- To: "${destinationQuery}" (coordinates: ${toLat}, ${toLon})

Available FROM station options:
${fromAlternatives.map((station, idx) => `${idx + 1}. ${station.name} (${station.subtext || 'No additional info'})`).join('\n')}

Available TO station options:
${toAlternatives.map((station, idx) => `${idx + 1}. ${station.name} (${station.subtext || 'No additional info'})`).join('\n')}

Analyze the user's intent based on:
1. The query text they entered
2. The coordinates provided (if available)
3. Context from the station names and subtext

Recommend which station ID matches the user's real intention for both FROM and TO locations.

Respond ONLY in this JSON format:
{
  "fromRecommendation": {
    "stationId": "id_of_recommended_station",
    "confidence": "high|medium|low",
    "reason": "brief explanation of why this matches user's intent"
  },
  "toRecommendation": {
    "stationId": "id_of_recommended_station",
    "confidence": "high|medium|low",
    "reason": "brief explanation of why this matches user's intent"
  }
}`;

        const result = await generateText({
            model: nim.chatModel("openai/gpt-oss-120b"),
            system: "You are a helpful travel assistant. Your task is to match user search queries to the correct bus stations. Always respond with valid JSON only.",
            prompt: prompt,
            maxOutputTokens: 1000,
        });

        // Parse the JSON response
        let suggestions;
        try {
            // Try to extract JSON if wrapped in markdown
            const jsonMatch = result.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                suggestions = JSON.parse(jsonMatch[0]);
            } else {
                suggestions = JSON.parse(result.text);
            }
        } catch (parseError) {
            console.error("Failed to parse AI response:", result.text);
            return Response.json({ 
                success: false, 
                error: "Failed to parse AI response",
                rawResponse: result.text 
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            suggestions
        });

    } catch (error) {
        console.error("AI station suggestion error:", error);
        return Response.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
