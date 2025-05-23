import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ToolCall, ToolMessageInput } from "../api.js";

export class McpClient {
  private transport: StdioClientTransport;
  private client: Client;

  constructor() {
    this.transport = new StdioClientTransport({
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem", "."]
    });
    this.client = new Client({
      name: "agent-mcp-client",
      version: "1.0.0"
    });
  }

  async connect() {
    await this.client.connect(this.transport);
  }

  async listTools() {
    return (await this.client.listTools()).tools.map(this.toOpenAiToolSchema);
  }

  async callTool(toolCall: ToolCall): Promise<ToolMessageInput> {
    const result = await this.client.callTool({
      name: toolCall.function.name,
      arguments: JSON.parse(toolCall.function.arguments)
    });
    return {
      role: "tool",
      content: result.content,
      tool_call_id: toolCall.id,
      name: toolCall.function.name,
    };
  }

  async close() {
    await this.client.close();
  }

  toOpenAiToolSchema(tool: Tool) {
    return {
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: "object",
          properties: tool.inputSchema.properties,
          required: tool.inputSchema.required
        }
      }
    };
  }
}

// // List prompts
// const prompts = await client.listPrompts();

// // Get a prompt
// const prompt = await client.getPrompt({
//   name: "example-prompt",
//   arguments: {
//     arg1: "value"
//   }
// });

// // List resources
// const resources = await client.listResources();

// // Read a resource
// const resource = await client.readResource({
//   uri: "file:///example.txt"
// });

// // Call a tool
// const result = await client.callTool({
//   name: "example-tool",
//   arguments: {
//     arg1: "value"
//   }
// });