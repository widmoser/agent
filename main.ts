// main.ts (derived from the old agent.ts)
import { runAgentLogic } from './agent.js'; // Import from the new agent.ts

const apiKey: string | undefined = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.error('Please set the OPENROUTER_API_KEY environment variable.');
    process.exit(1);
}

async function main() {
    const currentApiKey = apiKey as string; // apiKey is guaranteed non-null here
    const userQuery = 'What is the meaning of life?'; // Default query from original example

    try {
        console.log(`Executing agent for query: "${userQuery}"`);
        // Call the agent logic, potentially with optional model and system message
        const agentResponse = await runAgentLogic(currentApiKey, userQuery);
        console.log('Agent Response:', agentResponse);

        // Example of calling with optional parameters:
        // console.log('Executing agent with specific model and system message...');
        // const agentResponseWithOptions = await runAgentLogic(
        //     currentApiKey,
        //     userQuery,
        //     'mistralai/mistral-7b-instruct', // example model
        //     'You are an extremely concise assistant.'    // example systemMessage
        // );
        // console.log('Agent Response (with options):', agentResponseWithOptions);

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during agent execution:', error.message);
            if (error.cause) {
                 console.error('Cause:', error.cause);
            }
        } else {
            console.error('An unknown error occurred during agent execution:', error);
        }
        process.exit(1);
    }
}

main();

export {}; // ES Module standard practice if no other exports