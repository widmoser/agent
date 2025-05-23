import z from "zod";
import { ApiMessage, AssistantMessageInput, responseSchema } from "./api.js";

export async function queryLLM(
    apiKey: string,
    messages: ApiMessage[],
    model: string = 'openai/gpt-4o',
    tools: any[] = [],
): Promise<AssistantMessageInput> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            tools: tools,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const rawData = await response.json();
    console.log(' --- LLM response:', JSON.stringify(rawData, null, 4));
    try {
        const parsedData = responseSchema.parse(rawData);
        // The user's original code returned the whole message object, not just content
        // Assuming this is the desired behavior.
        return parsedData.choices[0].message; // Cast to any to match original return type
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Zod validation error:', error);
        }
        throw new Error(`Invalid response structure from LLM API: Unexpected error during parsing.`);
    }
}