// main.ts (derived from the old agent.ts)
import { runAgentLogic } from './agent.js'; // Import from the new agent.ts
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs/promises';

const apiKey: string | undefined = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.error('Please set the OPENROUTER_API_KEY environment variable.');
    process.exit(1);
}

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .usage('Usage: $0 [inlineQueryText] [--query <filePath>] [--model <modelName>] [--system <filePath>]')
        .option('model', {
            alias: 'm',
            type: 'string',
            description: 'The name of the LLM model that is being used.',
        })
        .option('query', {
            alias: 'q',
            type: 'string',
            description: 'Path to a file containing the task for the LLM to perform.',
        })
        .option('system', {
            alias: 's',
            type: 'string',
            description: 'Path to a file containing the system prompt for the LLM. If not provided, attempts to read from .system.md.',
        })
        // Positional arguments (like an inline query) will be in argv._
        .help()
        .alias('help', 'h')
        .parseAsync();

    const currentApiKey = apiKey as string;
    let userQuery: string;
    let systemPrompt: string | undefined;

    const queryArg = argv.query as string | undefined;
    const inlineQuery = argv._[0] as string | undefined;
    const systemArg = argv.system as string | undefined;

    let querySourceMessage: string;

    if (queryArg && inlineQuery) {
        console.error('Error: Ambiguous query. Please use either --query <filePath> OR an inline query (positional argument), but not both.');
        process.exit(1);
    }

    if (queryArg) {
        try {
            userQuery = await fs.readFile(queryArg, 'utf-8');
            querySourceMessage = `query from file: "${queryArg}"`;
        } catch (err) {
            console.error(`Error reading query file "${queryArg}":`, err);
            process.exit(1);
        }
    } else if (inlineQuery) {
        userQuery = inlineQuery;
        querySourceMessage = `inline query: "${userQuery}"`;
    } else {
        console.error('Error: No query provided. Please use --query <filePath> or provide an inline query text.');
        process.exit(1);
    }

    // Handle system prompt
    const systemPromptFilePath = systemArg || '.system.md';
    try {
        systemPrompt = await fs.readFile(systemPromptFilePath, 'utf-8');
    } catch (err) {
        console.error(`Error reading specified system prompt file "${systemPromptFilePath}":`, err);
        process.exit(1);
    }

    const modelName = argv.model as string | undefined;

    try {
        await runAgentLogic(currentApiKey, userQuery, modelName, systemPrompt);
    } catch (error) {
        console.error('Error during agent execution:', error);
        process.exit(1);
    }
}

main();

export {}; // ES Module standard practice if no other exports