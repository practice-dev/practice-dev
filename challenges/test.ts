import { runTests, ConsoleNotifier } from '@pvd/tester';
import { getDirnameById } from '@pvd/tools/src/helper';

const [, , id, url] = process.argv;

const dirName = getDirnameById(__dirname, Number(id));

if (!dirName) {
  throw new Error(`Cannot find challenge with id ${id}`);
}

async function run() {
  try {
    await runTests(
      'mock',
      url || 'http://localhost:1234',
      require(`./${dirName}/test-case`).default,
      new ConsoleNotifier()
    );
  } catch (e) {
    console.error(e.stack);
  } finally {
    process.exit();
  }
}

run();
