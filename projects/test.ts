import { runTests, ConsoleNotifier } from '@pvd/tester';
import { getDirnameById } from '@pvd/tools/src/helper';

const [, , projectId, challengeId, url] = process.argv;

const dirName = getDirnameById(__dirname, Number(projectId));

if (!dirName) {
  throw new Error(`Cannot find project with id ${projectId}`);
}

async function run() {
  try {
    await runTests(
      'mock',
      url || 'http://localhost:1234',
      require(`./${dirName}/challenge-${challengeId}/test-case`).default,
      new ConsoleNotifier()
    );
  } catch (e) {
    console.error(e.stack);
  } finally {
    process.exit();
  }
}

run();
