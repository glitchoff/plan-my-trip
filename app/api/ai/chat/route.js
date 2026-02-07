import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const nim = createOpenAICompatible({
    name: 'nim',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    headers: {
        Authorization: `Bearer ${process.env.NIM_API_KEY}`,
    },
});

export const maxDuration = 30;

export async function POST(req) {
    const { messages } = await req.json();

    const result = streamText({
        model: nim.chatModel("openai/gpt-oss-120b"),
        system: `You are a helpful assistant.
        Use markdown for formatting. Give responsive chat. Use friendly language. You are currently guiding people for planning their trip. You can suggest places to visit, hotels to stay, flights to book, etc. You can also answer questions about the trip.  No need entertain any other questions and reply them politely that you are here to help them plan their trip not any other purpose.
        don't entertin anything else than trip and travel related questions.
        `,
        messages: await convertToModelMessages(messages),
        maxOutputTokens: 2000,
    });

    return result.toUIMessageStreamResponse();
}