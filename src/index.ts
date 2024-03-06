import {versionConstraintSearch} from './search';
import {getMinMaxVersions} from './versions';

import {getInput, setOutput, setFailed} from '@actions/core';

async function run(): Promise<void> {
  const directory = getInput('directory');
  const versionConstraint = await versionConstraintSearch(directory);

  try {
    const pattern = versionConstraint.replace(/,|"/g, '');
    const [min, max] = await getMinMaxVersions(pattern);
    setOutput('minVersion', min);
    if (max) {
      setOutput('maxVersion', max);
    } else {
      setOutput('maxVersion', min);
    }
  } catch (err) {
    console.error(err);
  }
}

run().catch(error => {
  setFailed(error);
});
