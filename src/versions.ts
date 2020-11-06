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
  const result = fetch('https://releases.hashicorp.com/terraform/index.json')
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(`Failed to fetch version metadata. ${err}`);
    });

  return result;
}

export async function getMinMaxVersions(versionConstraint: string, options: Options = {}): Promise<MinMaxVersions> {
  const range = new semver.Range(versionConstraint.replace(/,/g, ''), options);
  const metadata = await getMetadata();
  const versions = Object.keys(metadata.versions);

  const min = semver.minSatisfying(versions, range) as string;
  const max = semver.maxSatisfying(versions, range) as string;

  if (min === max || versionConstraint === '*') {
    return [max];
  }

  return [min, max];
}
