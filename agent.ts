import { queryLLM } from './llm.js'; // Using .js extension for ES Module imports

const apiKey: string | undefined = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.error('Please set the OPENROUTER_API_KEY environment variable.');
    process.exit(1);
}

async function main() {
    const currentApiKey = apiKey as string; // apiKey is guaranteed non-null here

    try {
        const userMessages = [
            {
                role: 'user' as const,
                content: 'What is the meaning of life?',
            },
        ];

        console.log('Querying LLM...');
        const llmResponse = await queryLLM(currentApiKey, userMessages);
        console.log('LLM Response:', llmResponse);

        // Example of using optional parameters (currently commented out):
        // console.log('Querying LLM with options...');
        // const llmResponseWithOptions = await queryLLM(
        //     currentApiKey,
        //     userMessages,
        //     'mistralai/mistral-7b-instruct', // model
        //     'You are a concise assistant.'    // systemMessage
        // );
        // console.log('LLM Response (with options):', llmResponseWithOptions);

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during LLM query:', error.message);
            if (error.cause) {
                 console.error('Cause:', error.cause);
            }
        } else {
            console.error('An unknown error occurred during LLM query:', error);
        }
        process.exit(1);
    }
}

main();

export {};