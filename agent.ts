// agent.ts (new content)
import { queryLLM } from './llm.js';

interface UserMessageInput {
    role: 'user';
    content: string;
}

export async function runAgentLogic(
    apiKey: string,
    userQuery: string,
    model?: string, // Optional: pass model to queryLLM
    systemMessage?: string // Optional: pass systemMessage to queryLLM
): Promise<string> {
    const userMessages: UserMessageInput[] = [
        {
            role: 'user' as const,
            content: userQuery,
        },
    ];

    // console.log('Agent logic: Querying LLM...'); // For debugging
    const llmResponse = await queryLLM(apiKey, userMessages, model, systemMessage);
    return llmResponse;
}