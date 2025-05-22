// agent.ts (new content)
import { queryLLM } from './llm.js';
import { McpClient } from './mcp/mcp_client.js';

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
    const client = new McpClient();
    await client.connect();
    const tools = await client.listTools();
    console.log('Agent logic: Available tools:', tools.tools);
    const userMessages: UserMessageInput[] = [
        {
            role: 'user' as const,
            content: userQuery,
        },
    ];

    // console.log('Agent logic: Querying LLM...'); // For debugging
    const llmResponse = await queryLLM(apiKey, userMessages, model, systemMessage);
    await client.close();
    return llmResponse;
}