// agent.ts (new content)
import { ApiMessage, AssistantMessageInput } from './api.js';
import { queryLLM } from './llm.js';
import { McpClient } from './mcp/mcp_client.js';

export async function runAgentLogic(
    apiKey: string,
    userQuery: string,
    model?: string, // Optional: pass model to queryLLM
    systemMessage?: string // Optional: pass systemMessage to queryLLM
): Promise<string> {
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
        messages.push(llmResponse);
        if (!llmResponse.tool_calls) {
            await client.close();
            return llmResponse.content;
        }
        for (const toolCall of llmResponse.tool_calls || []) {
            console.log('Calling tool:', toolCall.function.name);
            console.log('Tool call arguments:', toolCall.function.arguments);
            const toolResponse = await client.callTool(toolCall);
            console.log('Tool response:', JSON.stringify(toolResponse, null, 4));
            messages.push(toolResponse);
        }
    }
}