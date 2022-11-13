import * as findInFiles from 'find-in-files';

const regExprRequiredVersion = /(?<=(required_version.=.)).*/;
const regExprFilename = /.*(versions|providers).tf$/;

export async function versionConstraintSearch(dir: string): Promise<string> {
  const files = await findInFiles.find('required_versions*s*', dir, '.tf$');
  const key = Object.keys(files)
    .sort((a, b) => a.length - b.length)
    .filter(word => regExprFilename.test(word))[0];
  const line = files[key].line;

  if (line) {
    const extractResults = regExprRequiredVersion.exec(line);
    const res = extractResults ? extractResults[0] : '';
    return res;
  }

  return '';
}
