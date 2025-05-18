// tools/readFile.test.ts
import { readFileTool } from '../tools/readFile';
import { vol } from 'memfs';

// Mock the fs module with memfs
jest.mock('fs')
jest.mock('fs/promises')

describe('ReadFileTool', () => {
    beforeEach(() => {
        // Reset the in-memory file system before each test
        vol.reset();
    });

    it('should have the correct name and schema', () => {
        expect(readFileTool.name).toBe('read_file');
        expect(readFileTool.schema).toBeDefined();
        expect(readFileTool.schema.function.name).toBe('read_file');
        expect(readFileTool.schema.function.parameters.properties.path).toBeDefined();
    });

    it('should successfully read an existing file', async () => {
        const filePath = './dummy.txt';
        const fileContent = 'Hello, world from memfs!';
        vol.fromJSON({
            [filePath]: fileContent,
        });

        const result = await readFileTool.execute({ path: filePath });
        expect(result).toBe(fileContent);
    });

    it('should return an error object if the file does not exist', async () => {
        const filePath = './nonexistent.txt';
        // No file created in vol

        const result = await readFileTool.execute({ path: filePath });
        expect(result).toEqual({ error: `File not found at path ${filePath}` });
    });

    it('should return an error object if the path is a directory', async () => {
        const dirPath = './aDirectory';
        const filePath = `${dirPath}/somefile.txt`
        vol.fromJSON({
            [filePath]: 'content' // Ensures aDirectory is a directory
        });

        const result = await readFileTool.execute({ path: dirPath });
        // console.log('EISDIR test result:', result); // For debugging if needed
        expect(result).toEqual({ error: `Path ${dirPath} is a directory, not a file.` });
    });
});
