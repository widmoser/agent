// tools/listFiles.ts
import * as fs from 'fs';
import * as path from 'path';

// Define the schema for the listFiles tool
const listFilesSchema = {
    type: 'function',
    function: {
        name: 'list_project_files',
        description: 'List project files for a given path.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path of the folder to list all of the files of this folder. This should be a relative path.',
                },
            },
            required: ['path'],
        },
    },
};

class ListFilesTool {
    public readonly name = listFilesSchema.function.name;
    public readonly schema = listFilesSchema;

    async execute(toolCall: { path: string }): Promise<string[]> {
        console.log(`Executing list_project_files for path: ${toolCall.path}`);
        const dirPath = toolCall.path;
        const filesFound: string[] = [];

        function findFilesRecursively(currentPath: string) {
            try {
                const entries = fs.readdirSync(currentPath, { withFileTypes: true });
                for (const entry of entries) {
                    const entryPath = path.join(currentPath, entry.name);
                    if (entry.isFile()) {
                        filesFound.push(entryPath);
                    } else if (entry.isDirectory()) {
                        findFilesRecursively(entryPath);
                    }
                }
            } catch (err: any) {
                // Log errors for inaccessible directories but continue traversal if possible
                console.warn(`Could not read directory ${currentPath}: ${err.message}`);
            }
        }

        try {
            // Check if the initial path exists and is a directory
            if (!fs.existsSync(dirPath)) {
                console.error(`Error: Path ${dirPath} does not exist.`);
                return [];
            }
            const initialStat = fs.statSync(dirPath);
            if (!initialStat.isDirectory()) {
                console.error(`Error: Path ${dirPath} is not a directory.`);
                return [];
            }
            
            findFilesRecursively(dirPath);
            return filesFound;
        } catch (error: any) {
            console.error(`Error listing files for path ${dirPath}:`, error.message);
            return []; // Return empty array on other errors
        }
    }
}

// Export an instance of the tool
export const listFilesTool = new ListFilesTool();
