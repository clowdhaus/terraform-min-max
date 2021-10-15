import {versionConstraintSearch} from './search';
import {getMinMaxVersions} from './versions';

import * as core from '@actions/core';

async function run(): Promise<void> {
  const directory = core.getInput('directory');
  const versionConstraint = await versionConstraintSearch(directory);

  try {
    const pattern = versionConstraint.replace(/,|"/g, '');
    const [min, max] = await getMinMaxVersions(pattern);
    core.setOutput('minVersion', min);
    if (max) {
      core.setOutput('maxVersion', max);
    } else {
      core.setOutput('maxVersion', min);
    }
  } catch (err) {
    console.error(err);
  }
}

run().catch(error => {
  core.setFailed(error);
});
