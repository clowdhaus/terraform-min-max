// Mock node-fetch before importing
jest.mock('node-fetch', () => jest.fn());

import {getMinMaxVersions} from './versions';

import fetch, {Response} from 'node-fetch';

const mockTerraformVersions = {
  name: 'terraform',
  versions: {
    '1.3.0': {},
    '1.3.1': {},
    '1.3.9': {},
    '1.4.0': {},
    '1.4.6': {},
    '1.5.0': {},
    '1.9.0': {},
    '1.10.0': {},
    '1.10.5': {},
    '1.11.0': {},
    '1.12.0': {},
    '2.0.0': {},
  },
};

beforeEach(() => {
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
    json: async () => mockTerraformVersions,
  } as Response);
});

describe('Exact version constraint (=)', () => {
  it('should return exact version for = constraint', async () => {
    const [min, max] = await getMinMaxVersions('= 1.4.0');

    expect(min).toBe('1.4.0');
    expect(max).toBeUndefined();
  });

  it('should handle exact version without = operator', async () => {
    const [min, max] = await getMinMaxVersions('1.4.0');

    expect(min).toBe('1.4.0');
    expect(max).toBeUndefined();
  });
});

describe('Comparison operators', () => {
  describe('Greater than (>)', () => {
    it('should handle > constraint', async () => {
      const [min, max] = await getMinMaxVersions('> 1.4.0');

      expect(min).toBe('1.4.6');
      expect(max).toBe('2.0.0');
    });
  });

  describe('Greater than or equal (>=)', () => {
    it('should handle >= constraint', async () => {
      const [min, max] = await getMinMaxVersions('>= 1.4.0');

      expect(min).toBe('1.4.0');
      expect(max).toBe('2.0.0');
    });
  });

  describe('Less than (<)', () => {
    it('should handle < constraint', async () => {
      const [min, max] = await getMinMaxVersions('< 1.4.0');

      expect(min).toBe('1.3.0');
      expect(max).toBe('1.3.9');
    });
  });

  describe('Less than or equal (<=)', () => {
    it('should handle <= constraint', async () => {
      const [min, max] = await getMinMaxVersions('<= 1.4.0');

      expect(min).toBe('1.3.0');
      expect(max).toBe('1.4.0');
    });
  });
});

describe('Range constraints', () => {
  it('should handle >= X, < Y range', async () => {
    const [min, max] = await getMinMaxVersions('>= 1.3.0, < 1.5.0');

    expect(min).toBe('1.3.0');
    expect(max).toBe('1.4.6');
  });

  it('should handle > X, <= Y range', async () => {
    const [min, max] = await getMinMaxVersions('> 1.3.0, <= 1.4.6');

    expect(min).toBe('1.3.1');
    expect(max).toBe('1.4.6');
  });
});

describe('Wildcard constraint (*)', () => {
  it('should return latest version for * constraint', async () => {
    const [min, max] = await getMinMaxVersions('*');

    expect(min).toBe('2.0.0');
    expect(max).toBeUndefined();
  });
});

describe('Terraform pessimistic constraint operator (~>)', () => {
  describe('~> X.Y (two-part version)', () => {
    it('should interpret ~> 1.3 as >= 1.3.0 and < 2.0.0', async () => {
      const [min, max] = await getMinMaxVersions('~> 1.3');

      expect(min).toBe('1.3.0');
      expect(max).toBe('1.12.0'); // Highest 1.x version available
    });

    it('should interpret ~> 1.10 as >= 1.10.0 and < 2.0.0', async () => {
      const [min, max] = await getMinMaxVersions('~> 1.10');

      expect(min).toBe('1.10.0');
      expect(max).toBe('1.12.0'); // Should NOT be 1.10.5
    });
  });

  describe('~> X.Y.Z (three-part version)', () => {
    it('should interpret ~> 1.3.1 as >= 1.3.1 and < 1.4.0', async () => {
      const [min, max] = await getMinMaxVersions('~> 1.3.1');

      expect(min).toBe('1.3.1');
      expect(max).toBe('1.3.9');
    });

    it('should interpret ~> 1.10.0 as >= 1.10.0 and < 1.11.0', async () => {
      const [min, max] = await getMinMaxVersions('~> 1.10.0');

      expect(min).toBe('1.10.0');
      expect(max).toBe('1.10.5');
    });
  });

  describe('Constraint with spaces', () => {
    it('should handle ~> with spaces correctly', async () => {
      const [min, max] = await getMinMaxVersions('~>  1.10');

      expect(min).toBe('1.10.0');
      expect(max).toBe('1.12.0');
    });
  });

  describe('Combined constraints', () => {
    it('should handle ~> combined with other constraints', async () => {
      const [min, max] = await getMinMaxVersions('~> 1.3, >= 1.4.0');

      expect(min).toBe('1.4.0');
      expect(max).toBe('1.12.0');
    });
  });
});
