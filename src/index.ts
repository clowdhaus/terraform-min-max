import {getInput, setOutput, setFailed} from '@actions/core';

import {versionConstraintSearch} from './search';
import {getMinMaxVersions} from './versions';

async function run(): Promise<void> {
  try {
    const directory = getInput('directory');
    const versionConstraint = await versionConstraintSearch(directory);
    const pattern = versionConstraint.replace(/,|"/g, '');
    const [min, max] = await getMinMaxVersions(pattern);

    setOutput('minVersion', min);
    setOutput('maxVersion', max ?? min);
  } catch (error) {
    setFailed(error instanceof Error ? error.message : String(error));
  }
}

run();
