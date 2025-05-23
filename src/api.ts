import { z } from 'zod';

export type ApiMessage = UserMessageInput | ToolMessageInput | SystemMessageInput | AssistantMessageInput;

export interface SystemMessageInput {
    role: 'system';
    content: string;
}

export interface UserMessageInput {
    role: 'user';
    content: string;
}

export interface ToolMessageInput {
    role: 'tool';
    content: any;
    tool_call_id: string;
    name: string;
}

const toolCallSchema = z.object({
    id: z.string(),
    type: z.string(),
    function: z.object({
        name: z.string(),
        arguments: z.string(),
    }),
});
// Zod Schemas for API response validation
const messageSchema = z.object({
    role: z.literal("assistant"),
    content: z.string(),
    tool_calls: z.array(toolCallSchema).optional(),
});

const choiceSchema = z.object({
    message: messageSchema,
});

export const responseSchema = z.object({
    choices: z.array(choiceSchema).min(1),
});

export type ToolCall = z.infer<typeof toolCallSchema>;
export type AssistantMessageInput = z.infer<typeof messageSchema>;