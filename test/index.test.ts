import {beforeEach, describe, expect, it, vi} from 'vitest';

const mockGetInput = vi.fn();
const mockSetOutput = vi.fn();
const mockSetFailed = vi.fn();

vi.mock('@actions/core', () => ({
  getInput: (...args: unknown[]) => mockGetInput(...args),
  setOutput: (...args: unknown[]) => mockSetOutput(...args),
  setFailed: (...args: unknown[]) => mockSetFailed(...args),
}));

vi.mock('../src/search', () => ({
  versionConstraintSearch: vi.fn(),
}));

vi.mock('../src/versions', () => ({
  getMinMaxVersions: vi.fn(),
}));

import {versionConstraintSearch} from '../src/search';
import {getMinMaxVersions} from '../src/versions';

const mockSearch = vi.mocked(versionConstraintSearch);
const mockGetMinMax = vi.mocked(getMinMaxVersions);

// Dynamically import index.ts to trigger run() after mocks are set up
async function runAction(): Promise<void> {
  vi.resetModules();
  // Re-register mocks after resetModules
  vi.doMock('@actions/core', () => ({
    getInput: (...args: unknown[]) => mockGetInput(...args),
    setOutput: (...args: unknown[]) => mockSetOutput(...args),
    setFailed: (...args: unknown[]) => mockSetFailed(...args),
  }));
  vi.doMock('../src/search', () => ({
    versionConstraintSearch: mockSearch,
  }));
  vi.doMock('../src/versions', () => ({
    getMinMaxVersions: mockGetMinMax,
  }));
  await import('../src/index');
}

describe('run()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set minVersion and maxVersion outputs', async () => {
    mockGetInput.mockReturnValue('tests/0.13');
    mockSearch.mockResolvedValue('">= 0.13.1, < 0.14"');
    mockGetMinMax.mockResolvedValue(['0.13.1', '0.13.7']);

    await runAction();

    expect(mockSearch).toHaveBeenCalledWith('tests/0.13');
    expect(mockGetMinMax).toHaveBeenCalledWith('>= 0.13.1, < 0.14');
    expect(mockSetOutput).toHaveBeenCalledWith('minVersion', '0.13.1');
    expect(mockSetOutput).toHaveBeenCalledWith('maxVersion', '0.13.7');
    expect(mockSetFailed).not.toHaveBeenCalled();
  });

  it('should strip quotes from version constraint', async () => {
    mockGetInput.mockReturnValue('.');
    mockSearch.mockResolvedValue('"~> 1.3"');
    mockGetMinMax.mockResolvedValue(['1.3.0', '1.12.0']);

    await runAction();

    expect(mockGetMinMax).toHaveBeenCalledWith('~> 1.3');
  });

  it('should set maxVersion to min when only one version returned', async () => {
    mockGetInput.mockReturnValue('.');
    mockSearch.mockResolvedValue('"1.4.0"');
    mockGetMinMax.mockResolvedValue(['1.4.0']);

    await runAction();

    expect(mockSetOutput).toHaveBeenCalledWith('minVersion', '1.4.0');
    expect(mockSetOutput).toHaveBeenCalledWith('maxVersion', '1.4.0');
  });

  it('should call setFailed on error', async () => {
    mockGetInput.mockReturnValue('/nonexistent');
    mockSearch.mockRejectedValue(new Error('No Terraform version constraint found in directory: /nonexistent'));

    await runAction();

    expect(mockSetFailed).toHaveBeenCalledWith('No Terraform version constraint found in directory: /nonexistent');
    expect(mockSetOutput).not.toHaveBeenCalled();
  });

  it('should handle non-Error throws', async () => {
    mockGetInput.mockReturnValue('.');
    mockSearch.mockRejectedValue('string error');

    await runAction();

    expect(mockSetFailed).toHaveBeenCalledWith('string error');
  });
});
