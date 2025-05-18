// tools/readFile.ts
import * as fs from 'fs/promises'; // Using promises for async file reading

// Define the schema for the readFile tool
const readFileSchema = {
    type: 'function',
    function: {
        name: 'read_file',
        description: 'Reads the content of a specified file.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The relative path of the file to be read.',
                },
            },
            required: ['path'],
        },
    },
};

class ReadFileTool {
    public readonly name = readFileSchema.function.name;
    public readonly schema = readFileSchema;

    async execute(toolCall: { path: string }): Promise<string | { error: string }> {
        console.log(`Executing read_file for path: ${toolCall.path}`);
        const filePath = toolCall.path;

        try {
            return await fs.readFile(filePath, 'utf-8');
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.error(`Error: File not found at path ${filePath}`);
                return { error: `File not found at path ${filePath}` };
            } else if (error.code === 'EISDIR') {
                console.error(`Error: Path ${filePath} is a directory, not a file.`);
                return { error: `Path ${filePath} is a directory, not a file.` };
            }
            console.error(`Error reading file ${filePath}:`, error.message);
            return { error: `Error reading file ${filePath}: ${error.message}` };
        }
    }
}

// Export an instance of the tool
export const readFileTool = new ReadFileTool();
