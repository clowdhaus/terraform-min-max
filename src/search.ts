import * as core from '@actions/core';
import * as findInFiles from 'find-in-files';

const regExprRequiredVersion = /(?<=(required_version.=.)).*/;
const regExprWrappers = /wrappers/;

export async function versionConstraintSearch(dir: string): Promise<string> {
  const files = await findInFiles.find('required_versions*s*', dir, '.tf$');
  core.debug(`files: ${files}`);

  const filteredResults = Object.keys(files)
    .sort((a, b) => a.length - b.length)
    .filter(word => !regExprWrappers.test(word));
  core.debug(`filteredResults: ${filteredResults}`);
  const line = files[filteredResults[0]].line;

  if (line) {
    const extractResults = regExprRequiredVersion.exec(line);
    const res = extractResults ? extractResults[0] : '';
    core.debug(`Result: ${res}`);
    return res;
  }

  return '';
}
