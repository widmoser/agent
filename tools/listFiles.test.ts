import { listFilesTool } from './listFiles';
import { vol } from 'memfs';

// Mock the fs module with memfs
jest.mock('fs')
jest.mock('fs/promises')

describe('listFilesTool', () => {
  beforeEach(() => {
    // Reset the in-memory file system before each test
    vol.reset();
  });

  it('should list files in a simple directory', async () => {
    vol.fromJSON({
      './testdir/file1.txt': 'content',
      './testdir/file2.txt': 'content',
    });

    const result = await listFilesTool.execute({ path: './testdir' });
    expect(result).toHaveLength(2);
    expect(result).toContain('testdir/file1.txt');
    expect(result).toContain('testdir/file2.txt');
  });

  it('should list files in a nested directory structure', async () => {
    vol.fromJSON({
      './testdir/file1.txt': 'content',
      './testdir/subdir/file2.txt': 'content',
      './testdir/subdir/anotherfile.md': 'content',
      './testdir/emptydir/.gitkeep': null, // Simulate an empty directory marker
    });

    const result = await listFilesTool.execute({ path: './testdir' });
    expect(result).toHaveLength(3); // .gitkeep is a file
    expect(result).toContain('testdir/file1.txt');
    expect(result).toContain('testdir/subdir/file2.txt');
    expect(result).toContain('testdir/subdir/anotherfile.md');
  });

  it('should return an empty array for an empty directory', async () => {
    vol.fromJSON({
      './emptydir/.gitkeep': null, // Simulate an empty directory
    });

    const result = await listFilesTool.execute({ path: './emptydir' });
    expect(result).toHaveLength(0);
  });


  it('should return an empty array for a non-existent path', async () => {
    const result = await listFilesTool.execute({ path: './nonexistentdir' });
    expect(result).toEqual([]);
  });

  it('should return an empty array if the path is a file', async () => {
    vol.fromJSON({
      './testfile.txt': 'content',
    });

    const result = await listFilesTool.execute({ path: './testfile.txt' });
    expect(result).toEqual([]);
  });
});