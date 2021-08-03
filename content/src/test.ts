import Path from 'path';
import { runTests, ConsoleNotifier } from '@pvd/tester';
import { findChallengeDir } from '@pvd/tools/src/helper';

const moduleId = process.argv[2];
const challengeId = process.argv[3];
const url = process.argv[4];

if (!moduleId) {
  throw new Error('Missing module id');
}

if (!Number(moduleId)) {
  throw new Error('Invalid module id');
}

if (!challengeId) {
  throw new Error('Missing challenge id');
}

if (!Number(challengeId)) {
  throw new Error('Invalid challenge id');
}

const { challengePath } = findChallengeDir(
  Path.join(__dirname, '../modules'),
  Number(moduleId),
  Number(challengeId)
);

async function run() {
  try {
    await runTests(
      'mock',
      url || 'http://localhost:1234',
      require(`${challengePath}/test-case`).default,
      new ConsoleNotifier()
    );
  } catch (e) {
    console.error(e.stack);
  } finally {
    process.exit();
  }
}

run();
