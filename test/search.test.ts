import {describe, expect, it, vi} from 'vitest';
import {versionConstraintSearch} from '../src/search';

vi.mock('find-in-files', () => ({
  find: vi.fn(),
}));

vi.mock('@actions/core', () => ({
  debug: vi.fn(),
}));

import {find} from 'find-in-files';

const mockFind = vi.mocked(find);

describe('versionConstraintSearch', () => {
  it('should extract version constraint from matching file', async () => {
    mockFind.mockResolvedValue({
      '/project/versions.tf': {
        matches: ['required_version'],
        count: 1,
        line: 'required_version = ">= 1.3.0"',
      },
    });

    const result = await versionConstraintSearch('/project');

    expect(result).toBe('">= 1.3.0"');
  });

  it('should handle pessimistic constraint', async () => {
    mockFind.mockResolvedValue({
      '/project/versions.tf': {
        matches: ['required_version'],
        count: 1,
        line: 'required_version = "~> 1.3"',
      },
    });

    const result = await versionConstraintSearch('/project');

    expect(result).toBe('"~> 1.3"');
  });

  it('should filter out wrappers directories', async () => {
    mockFind.mockResolvedValue({
      '/project/versions.tf': {
        matches: ['required_version'],
        count: 1,
        line: 'required_version = ">= 1.0.0"',
      },
      '/project/wrappers/versions.tf': {
        matches: ['required_version'],
        count: 1,
        line: 'required_version = ">= 0.13"',
      },
    });

    const result = await versionConstraintSearch('/project');

    expect(result).toBe('">= 1.0.0"');
  });

  it('should pick shortest path when multiple files match', async () => {
    mockFind.mockResolvedValue({
      '/project/modules/deep/versions.tf': {
        matches: ['required_version'],
        count: 1,
        line: 'required_version = ">= 0.13"',
      },
      '/project/versions.tf': {
        matches: ['required_version'],
        count: 1,
        line: 'required_version = ">= 1.0.0"',
      },
    });

    const result = await versionConstraintSearch('/project');

    expect(result).toBe('">= 1.0.0"');
  });

  it('should throw when no files match', async () => {
    mockFind.mockResolvedValue({});

    await expect(versionConstraintSearch('/empty')).rejects.toThrow(
      'No Terraform version constraint found in directory: /empty',
    );
  });

  it('should throw when all matches are in wrappers', async () => {
    mockFind.mockResolvedValue({
      '/project/wrappers/versions.tf': {
        matches: ['required_version'],
        count: 1,
        line: 'required_version = ">= 0.13"',
      },
    });

    await expect(versionConstraintSearch('/project')).rejects.toThrow(
      'No Terraform version constraint found in directory: /project',
    );
  });

  it('should throw when line is null', async () => {
    mockFind.mockResolvedValue({
      '/project/versions.tf': {
        matches: ['required_version'],
        count: 1,
        line: null,
      },
    });

    await expect(versionConstraintSearch('/project')).rejects.toThrow(
      'No version constraint line found in: /project/versions.tf',
    );
  });

  it('should throw when regex does not match', async () => {
    mockFind.mockResolvedValue({
      '/project/versions.tf': {
        matches: ['required_version'],
        count: 1,
        line: 'some_other_content_without_required_version_equals',
      },
    });

    await expect(versionConstraintSearch('/project')).rejects.toThrow(
      'Could not parse version constraint from:',
    );
  });
});
