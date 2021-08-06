import { TestConfiguration, Notifier } from './types';
import { Tester } from './Tester';
import { getBrowser } from './getBrowser';
import { TestInfo } from '@pvd/types';
import { Browser } from 'puppeteer';
import { TestError } from './TestError';
import { isPuppeteerTimeout } from './helper';

export async function runTests(
  id: string,
  url: string,
  config: TestConfiguration,
  notifier: Notifier
) {
  const createdBrowsers: Record<string, Browser> = {};
  const meta = { submissionId: id };
  let currentTestId = 0;

  const tester = new Tester(
    {
      notify(text, data) {
        return notifier.notify({
          type: 'TEST_STEP',
          meta,
          payload: { text, data, testId: currentTestId },
        });
      },
    },
    async (contextId = 'default') => {
      if (!createdBrowsers[contextId]) {
        createdBrowsers[contextId] = await getBrowser();
      }
      return createdBrowsers[contextId].newPage();
    }
  );

  await config.handler({
    tester,
    url,
  });

  let success = true;

  const serialized: TestInfo[] = tester.tests.map(test => ({
    id: test.id,
    name: test.name,
    result: 'pending',
    steps: [],
  }));
  serialized[0].result = 'running';

  await notifier.notify({
    type: 'TEST_INFO',
    meta,
    payload: { tests: serialized },
  });
  await notifier.flush();

  for (const test of tester.tests) {
    currentTestId = test.id;
    await notifier.notify({
      type: 'TEST_START',
      meta,
      payload: { testId: test.id },
    });

    try {
      await test.exec();
      await notifier.notify({
        type: 'TEST_PASS',
        meta,
        payload: { testId: test.id },
      });
    } catch (e) {
      success = false;
      if (e instanceof TestError || isPuppeteerTimeout(e)) {
        await notifier.notify({
          type: 'TEST_FAIL',
          meta,
          payload: { testId: test.id, error: e.message },
        });
      } else {
        console.error(`Internal error when testing ${id}`, e);
        await notifier.notify({
          type: 'TEST_FAIL',
          meta,
          payload: { testId: test.id, error: 'Internal Error' },
        });
      }
      break;
    }
  }
  await notifier.notify({ type: 'TEST_RESULT', meta, payload: { success } });
  await notifier.flush();

  Object.values(createdBrowsers).forEach(browser => {
    try {
      void browser.close();
    } catch (e) {
      console.error(e);
    }
  });
}
