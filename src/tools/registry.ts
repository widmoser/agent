// tools/registry.ts

import { listFilesTool } from './listFiles.js';
import { readFileTool } from './readFile.js';

// Define the array of all tools
export const toolRegistry = [
    listFilesTool,
    readFileTool,
    // Add other tools here as they are created
];

export const toolSpecs = toolRegistry.map(
    tool => tool.schema
);