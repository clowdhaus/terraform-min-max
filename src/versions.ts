import * as semver from 'semver';

interface TerraformMetadata {
  name: string;
  versions: Record<string, unknown>;
}

type MinMaxVersions = [string, string?];

const TERRAFORM_RELEASES_URL = 'https://releases.hashicorp.com/terraform/index.json';
const FETCH_TIMEOUT_MS = 30_000;

async function getMetadata(): Promise<TerraformMetadata> {
  const response = await fetch(TERRAFORM_RELEASES_URL, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Terraform metadata: ${response.status} ${response.statusText}`);
  }

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

  const min = semver.minSatisfying(versions, range);
  const max = semver.maxSatisfying(versions, range);

  if (!min || !max) {
    throw new Error(`No Terraform versions found satisfying constraint: ${versionConstraint}`);
  }

  if (min === max || versionConstraint === '*') {
    return [max];
  }

  return [min, max];
}
