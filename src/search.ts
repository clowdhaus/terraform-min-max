import {readdir, readFile} from 'node:fs/promises';
import {join} from 'node:path';

import {debug} from '@actions/core';

const REQUIRED_VERSION_PATTERN = /required_version\s*=\s*(.*)/;
const WRAPPER_DIR_PATTERN = /wrappers/;

async function findTfFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await readdir(dir, {withFileTypes: true});

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.terraform') {
      results.push(...await findTfFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.tf')) {
      results.push(fullPath);
    }
  }

  return results;
}

export async function versionConstraintSearch(dir: string): Promise<string> {
  const tfFiles = await findTfFiles(dir);
  debug(`tfFiles: ${JSON.stringify(tfFiles)}`);

  const matches: {path: string; constraint: string}[] = [];

  for (const filePath of tfFiles) {
    if (WRAPPER_DIR_PATTERN.test(filePath)) continue;

    const content = await readFile(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = REQUIRED_VERSION_PATTERN.exec(line);
      if (match) {
        matches.push({path: filePath, constraint: match[1].trim()});
        break;
      }
    }
  }

  debug(`matches: ${JSON.stringify(matches)}`);

  if (matches.length === 0) {
    throw new Error(`No Terraform version constraint found in directory: ${dir}`);
  }

  // Pick the shortest path (root-level versions.tf preferred over nested)
  matches.sort((a, b) => a.path.length - b.path.length);
  const result = matches[0].constraint;

  debug(`Result: ${result}`);
  return result;
}
