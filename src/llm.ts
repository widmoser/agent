import { toolSpecs } from "./tools/registry.js";

interface ApiMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface UserMessageInput {
    role: 'user';
    content: string;
}

export async function queryLLM(
    apiKey: string,
    userMessages: UserMessageInput[],
    model: string = 'openai/gpt-4o',
    systemMessage?: string
): Promise<string> {

    const messages: ApiMessage[] = [];

    if (systemMessage) {
        messages.push({ role: 'system', content: systemMessage });
    }

    messages.push(...userMessages.map(msg => ({ ...msg } as ApiMessage)));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            tools: toolSpecs,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data && data.choices && Array.isArray(data.choices) && data.choices.length > 0 &&
        data.choices[0].message && typeof data.choices[0].message.content === 'string') {
        return data.choices[0].message;
    } else {
        let detail = "Unexpected response structure.";
        if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
            detail = "Choices array is missing or empty.";
        } else if (!data.choices[0].message) {
            detail = "Message object is missing in the first choice.";
        } else if (typeof data.choices[0].message.content !== 'string') {
            detail = "Message content is not a string or is missing.";
        }
        throw new Error(`Invalid response structure from LLM API: ${detail}`);
    }
}