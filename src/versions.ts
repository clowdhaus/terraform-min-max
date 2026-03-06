import fetch from 'node-fetch';
import * as semver from 'semver';

interface TerraformMetadata {
  name: string;
  versions: Record<string, unknown>;
}

type MinMaxVersions = [string, string?];

async function getMetadata(): Promise<TerraformMetadata> {
  const response = await fetch('https://releases.hashicorp.com/terraform/index.json');
  return response.json() as Promise<TerraformMetadata>;
}

/**
 * Converts Terraform's ~> syntax to semver-compatible range
 * ~> X.Y means >= X.Y.0, < (X+1).0.0
 * ~> X.Y.Z means >= X.Y.Z, < X.(Y+1).0
 */
function convertTerraformConstraint(constraint: string): string {
  const pessimistic = /~>\s*(\d+)\.(\d+)(?:\.(\d+))?/g;

  return constraint.replace(pessimistic, (_match, major, minor, patch) => {
    if (patch !== undefined) {
      return `>=${major}.${minor}.${patch} <${major}.${parseInt(minor) + 1}.0`;
    }
    return `>=${major}.${minor}.0 <${parseInt(major) + 1}.0.0`;
  });
}

export async function getMinMaxVersions(versionConstraint: string): Promise<MinMaxVersions> {
  const convertedConstraint = convertTerraformConstraint(versionConstraint);
  const range = new semver.Range(convertedConstraint.replace(/,/g, ''));
  const metadata = await getMetadata();
  const versions = Object.keys(metadata.versions);

  const min = semver.minSatisfying(versions, range) as string;
  const max = semver.maxSatisfying(versions, range) as string;

  if (min === max || versionConstraint === '*') {
    return [max];
  }

  return [min, max];
}
