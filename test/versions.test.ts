import {beforeEach, describe, expect, it, vi} from 'vitest';
import {convertTerraformConstraint, getMinMaxVersions} from '../src/versions';

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
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockTerraformVersions,
  }));
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
      expect(max).toBe('1.12.0');
    });

    it('should interpret ~> 1.10 as >= 1.10.0 and < 2.0.0', async () => {
      const [min, max] = await getMinMaxVersions('~> 1.10');

      expect(min).toBe('1.10.0');
      expect(max).toBe('1.12.0');
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

describe('convertTerraformConstraint', () => {
  it('should convert ~> X.Y to >= X.Y.0 < (X+1).0.0', () => {
    expect(convertTerraformConstraint('~> 1.3')).toBe('>=1.3.0 <2.0.0');
  });

  it('should convert ~> X.Y.Z to >= X.Y.Z < X.(Y+1).0', () => {
    expect(convertTerraformConstraint('~> 1.3.1')).toBe('>=1.3.1 <1.4.0');
  });

  it('should convert ~> 0.Y to >= 0.Y.0 < 1.0.0', () => {
    expect(convertTerraformConstraint('~> 0.12')).toBe('>=0.12.0 <1.0.0');
  });

  it('should convert ~> 0.Y.Z to >= 0.Y.Z < 0.(Y+1).0', () => {
    expect(convertTerraformConstraint('~> 0.12.26')).toBe('>=0.12.26 <0.13.0');
  });

  it('should pass through non-pessimistic constraints unchanged', () => {
    expect(convertTerraformConstraint('>= 1.0.0')).toBe('>= 1.0.0');
    expect(convertTerraformConstraint('< 2.0.0')).toBe('< 2.0.0');
    expect(convertTerraformConstraint('= 1.4.0')).toBe('= 1.4.0');
    expect(convertTerraformConstraint('*')).toBe('*');
  });

  it('should handle combined constraints with ~>', () => {
    expect(convertTerraformConstraint('~> 1.3, >= 1.4.0')).toBe('>=1.3.0 <2.0.0, >= 1.4.0');
  });

  it('should handle extra whitespace after ~>', () => {
    expect(convertTerraformConstraint('~>  1.10')).toBe('>=1.10.0 <2.0.0');
  });
});

describe('Error handling', () => {
  it('should throw when no versions satisfy the constraint', async () => {
    await expect(getMinMaxVersions('>= 99.0.0')).rejects.toThrow(
      'No Terraform versions found satisfying constraint: >= 99.0.0',
    );
  });

  it('should throw when fetch returns non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
    }));

    await expect(getMinMaxVersions('>= 1.0.0')).rejects.toThrow(
      'Failed to fetch Terraform metadata: 503 Service Unavailable',
    );
  });

  it('should throw when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));

    await expect(getMinMaxVersions('>= 1.0.0')).rejects.toThrow('network error');
  });
});
