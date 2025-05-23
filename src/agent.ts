// agent.ts (new content)
import { ApiMessage, AssistantMessageInput } from './api.js';
import { queryLLM } from './llm.js';
import { McpClient } from './mcp/mcp_client.js';

export async function runAgentLogic(
    apiKey: string,
    userQuery: string,
    model?: string, // Optional: pass model to queryLLM
    systemMessage?: string // Optional: pass systemMessage to queryLLM
): Promise<void> {
    const client = new McpClient();
    await client.connect();
    const tools = await client.listTools();
    const messages: ApiMessage[] = [];

    if (systemMessage) {
        messages.push({
            role: 'system',
            content: systemMessage,
        });
    }

    messages.push({
        role: 'user',
        content: userQuery,
    });

    while (true) {
        const llmResponse = await queryLLM(apiKey, messages, model, tools);
        console.log('\n\n--------------\n\n');
        if (llmResponse.content) {
            console.log(llmResponse.content);
        }
        messages.push(llmResponse);
        if (!llmResponse.tool_calls) {
            await client.close();
            return;
        }
        for (const toolCall of llmResponse.tool_calls || []) {
            console.log('Tool call:', toolCall.function.name);
            const toolResponse = await client.callTool(toolCall);
            messages.push(toolResponse);
        }
    }
}