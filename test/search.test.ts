import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('@actions/core', () => ({
  debug: vi.fn(),
}));

vi.mock('node:fs/promises', () => ({
  readdir: vi.fn(),
  readFile: vi.fn(),
}));

import {readdir, readFile} from 'node:fs/promises';
import {versionConstraintSearch} from '../src/search';

const mockReaddir = vi.mocked(readdir);
const mockReadFile = vi.mocked(readFile);

interface MockDirent {
  name: string;
  isDirectory: () => boolean;
  isFile: () => boolean;
}

function dirent(name: string, type: 'file' | 'dir'): MockDirent {
  return {
    name,
    isDirectory: () => type === 'dir',
    isFile: () => type === 'file',
  };
}

describe('versionConstraintSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should extract version constraint from matching file', async () => {
    mockReaddir.mockResolvedValueOnce([dirent('versions.tf', 'file')] as never);
    mockReadFile.mockResolvedValueOnce('terraform {\n  required_version = ">= 1.3.0"\n}\n');

    const result = await versionConstraintSearch('/project');

    expect(result).toBe('">= 1.3.0"');
  });

  it('should handle pessimistic constraint', async () => {
    mockReaddir.mockResolvedValueOnce([dirent('versions.tf', 'file')] as never);
    mockReadFile.mockResolvedValueOnce('terraform {\n  required_version = "~> 1.3"\n}\n');

    const result = await versionConstraintSearch('/project');

    expect(result).toBe('"~> 1.3"');
  });

  it('should filter out wrappers directories', async () => {
    // Root dir has versions.tf and wrappers/
    mockReaddir.mockResolvedValueOnce([
      dirent('versions.tf', 'file'),
      dirent('wrappers', 'dir'),
    ] as never);
    // wrappers/ has versions.tf
    mockReaddir.mockResolvedValueOnce([dirent('versions.tf', 'file')] as never);

    mockReadFile.mockResolvedValueOnce('terraform {\n  required_version = ">= 1.0.0"\n}\n');
    // wrappers/versions.tf should not be read since path is filtered

    const result = await versionConstraintSearch('/project');

    expect(result).toBe('">= 1.0.0"');
  });

  it('should pick shortest path when multiple files match', async () => {
    // Root has modules/ dir and versions.tf
    mockReaddir.mockResolvedValueOnce([
      dirent('modules', 'dir'),
      dirent('versions.tf', 'file'),
    ] as never);
    // modules/ has versions.tf
    mockReaddir.mockResolvedValueOnce([dirent('versions.tf', 'file')] as never);

    // Files read in order: modules/versions.tf then root versions.tf
    mockReadFile.mockResolvedValueOnce('terraform {\n  required_version = ">= 0.13"\n}\n');
    mockReadFile.mockResolvedValueOnce('terraform {\n  required_version = ">= 1.0.0"\n}\n');

    const result = await versionConstraintSearch('/project');

    // Root versions.tf has shorter path, so its constraint wins
    expect(result).toBe('">= 1.0.0"');
  });

  it('should throw when no .tf files exist', async () => {
    mockReaddir.mockResolvedValueOnce([dirent('README.md', 'file')] as never);

    await expect(versionConstraintSearch('/empty')).rejects.toThrow(
      'No Terraform version constraint found in directory: /empty',
    );
  });

  it('should throw when no files contain required_version', async () => {
    mockReaddir.mockResolvedValueOnce([dirent('main.tf', 'file')] as never);
    mockReadFile.mockResolvedValueOnce('resource "aws_instance" "example" {}\n');

    await expect(versionConstraintSearch('/project')).rejects.toThrow(
      'No Terraform version constraint found in directory: /project',
    );
  });

  it('should throw when all matches are in wrappers', async () => {
    mockReaddir.mockResolvedValueOnce([dirent('wrappers', 'dir')] as never);
    mockReaddir.mockResolvedValueOnce([dirent('versions.tf', 'file')] as never);

    await expect(versionConstraintSearch('/project')).rejects.toThrow(
      'No Terraform version constraint found in directory: /project',
    );
  });

  it('should skip node_modules and .terraform directories', async () => {
    mockReaddir.mockResolvedValueOnce([
      dirent('node_modules', 'dir'),
      dirent('.terraform', 'dir'),
      dirent('versions.tf', 'file'),
    ] as never);
    mockReadFile.mockResolvedValueOnce('terraform {\n  required_version = ">= 1.5.0"\n}\n');

    const result = await versionConstraintSearch('/project');

    expect(result).toBe('">= 1.5.0"');
    // readdir should only be called once (root), not for node_modules or .terraform
    expect(mockReaddir).toHaveBeenCalledTimes(1);
  });
});
