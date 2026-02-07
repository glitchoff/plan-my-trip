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
        system: 'You are a helpful assistant.',
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}