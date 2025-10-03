import fetch from 'node-fetch';
import * as semver from 'semver';

export interface Metadata {
  name: 'terraform';
  versions: Version[];
}

export enum Arch {
  arm = 'arm',
  x64 = 'amd64',
  x32 = '386',
}

export enum Os {
  darwin = 'darwin',
  freebsd = 'freebsd',
  linux = 'linux',
  openbsd = 'openbsd',
  solaris = 'solaris',
  windows = 'windows',
}

export interface Version {
  name: 'terraform';
  version: string;
  shasums: string;
  shasums_signature: string;
  builds: Build[];
}

export interface Build {
  name: 'terraform';
  version: string;
  os: 'terraform';
  arch: string;
  filename: string;
  url: string;
}

export interface Options {
  includePrerelease?: boolean;
  loose?: boolean;
}

export type MinMaxVersions = [string, string?];

export async function getMetadata(): Promise<Metadata> {
  const result = await fetch('https://releases.hashicorp.com/terraform/index.json');
  const jsonObj = result.json() as unknown;
  return <Metadata>jsonObj;
}

/**
 * Converts Terraform's ~> syntax to semver-compatible range
 * ~> X.Y means >= X.Y.0, < (X+1).0.0
 * ~> X.Y.Z means >= X.Y.Z, < X.(Y+1).0
 */
function convertTerraformConstraint(constraint: string): string {
  // Match Terraform's pessimistic constraint operator
  const terraformPessimistic = /~>\s*(\d+)\.(\d+)(?:\.(\d+))?/g;

  return constraint.replace(terraformPessimistic, (_match, major, minor, patch) => {
    if (patch !== undefined) {
      // ~> X.Y.Z means >= X.Y.Z, < X.(Y+1).0
      const nextMinor = parseInt(minor) + 1;
      return `>=${major}.${minor}.${patch} <${major}.${nextMinor}.0`;
    } else {
      // ~> X.Y means >= X.Y.0, < (X+1).0.0
      const nextMajor = parseInt(major) + 1;
      return `>=${major}.${minor}.0 <${nextMajor}.0.0`;
    }
  });
}

export async function getMinMaxVersions(versionConstraint: string, options: Options = {}): Promise<MinMaxVersions> {
  const convertedConstraint = convertTerraformConstraint(versionConstraint);
  const range = new semver.Range(convertedConstraint.replace(/,/g, ''), options);
  const metadata = await getMetadata();
  const versions = Object.keys(metadata.versions);

  const min = semver.minSatisfying(versions, range) as string;
  const max = semver.maxSatisfying(versions, range) as string;

  if (min === max || versionConstraint === '*') {
    return [max];
  }

  return [min, max];
}
