import {debug} from '@actions/core';
import * as findInFiles from 'find-in-files';

const REQUIRED_VERSION_PATTERN = /(?<=(required_version.=.)).*/;
const WRAPPER_DIR_PATTERN = /wrappers/;

export async function versionConstraintSearch(dir: string): Promise<string> {
  // Fuzzy pattern matches both "required_version" and "required_versions"
  const files = await findInFiles.find('required_versions*s*', dir, '.tf$');
  debug(`files: ${JSON.stringify(Object.keys(files))}`);

  const filteredResults = Object.keys(files)
    .sort((a, b) => a.length - b.length)
    .filter(path => !WRAPPER_DIR_PATTERN.test(path));
  debug(`filteredResults: ${JSON.stringify(filteredResults)}`);

  if (filteredResults.length === 0) {
    throw new Error(`No Terraform version constraint found in directory: ${dir}`);
  }

  const line = files[filteredResults[0]].line;
  if (!line) {
    throw new Error(`No version constraint line found in: ${filteredResults[0]}`);
  }

  const match = REQUIRED_VERSION_PATTERN.exec(line);
  if (!match) {
    throw new Error(`Could not parse version constraint from: ${line}`);
  }

  debug(`Result: ${match[0]}`);
  return match[0];
}
