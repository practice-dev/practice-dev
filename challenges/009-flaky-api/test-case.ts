import { TestConfiguration } from '@pvd/tester';
import type { TesterPage } from '@pvd/tester/src/TesterPage';

const BASE_URL = 'https://flaky-api.pvd-api.dev';

const RES_400 = {
  status: 400,
  json: { color: 'Oops Error' },
};
const RES_500 = {
  status: 500,
  json: { color: 'Oops Error' },
};
const RES_200_RED = { status: 200, json: { color: 'Red' } };
const RES_200_GREEN = { status: 200, json: { color: 'Green' } };
const RES_200_BLUE = { status: 200, json: { color: 'Blue' } };

async function makeTest(page: TesterPage, responses: any[], result: string) {
  const requestMock = await page.enableRequestMocking();
  const req = requestMock.mock(BASE_URL, 'GET', '/');
  const defer = requestMock.createDefer();
  await req.block();
  await page.expectToMatch('@result', 'No Result');
  await req.respond(n => {
    const res = responses[n - 1];
    const isLast = n === responses.length;
    if (res) {
      return isLast ? { ...res, defer } : res;
    }
    return RES_500;
  });
  await req.unblock();
  await page.click('@fetch-btn');
  await page.expectToBeDisabled('@fetch-btn');
  defer.resolve();
  await page.expectToMatch('@result', result);
  await page.expectToBeEnabled('@fetch-btn');
  await req.expectToBeCalled(responses.length);
}

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('200', async () => {
      const page = await tester.getPage();
      await makeTest(page, [RES_200_BLUE], 'Blue');
    });

    tester.test('400 -> 200', async () => {
      const page = await tester.getPage();
      await page.reload();
      await makeTest(page, [RES_400, RES_200_GREEN], 'Green (2)');
    });

    tester.test('500', async () => {
      const page = await tester.getPage();
      await page.reload();
      await makeTest(page, [RES_500], 'Error');
    });

    tester.test('400 -> 500', async () => {
      const page = await tester.getPage();
      await page.reload();
      await makeTest(page, [RES_400, RES_500], 'Error');
    });

    tester.test('400 -> 400 -> 200', async () => {
      const page = await tester.getPage();
      await page.reload();
      await makeTest(page, [RES_400, RES_400, RES_200_RED], 'Red (3)');
    });

    tester.test('400 -> 400 -> 400 -> 400 -> 400 -> 200', async () => {
      const page = await tester.getPage();
      await page.reload();
      await makeTest(
        page,
        [RES_400, RES_400, RES_400, RES_400, RES_400, RES_200_GREEN],
        'Green (6)'
      );
    });

    tester.test('400 -> 400 -> 400 -> 400 -> 400 -> 500', async () => {
      const page = await tester.getPage();
      await page.reload();
      await makeTest(
        page,
        [RES_400, RES_400, RES_400, RES_400, RES_400, RES_500],
        'Error'
      );
    });
  },
} as TestConfiguration;
