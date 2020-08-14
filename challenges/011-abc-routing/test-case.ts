import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    const check = async (letter: string) => {
      const page = await tester.getPage();
      await page.click('@link-' + letter);
      await page.expectUrlToMatch('/page-' + letter);
      await page.expectToMatch('@text', letter.toUpperCase());
      await page.reload();
      await page.expectToMatch('@text', letter.toUpperCase());
      await page.expectUrlToMatch('/page-' + letter);
    };

    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('check / page', async () => {
      const page = await tester.getPage();
      await page.expectUrlToMatch('/');
      await page.expectToMatch('@text', 'A', true);
      await page.expectToMatch('@link-a', 'Page A', true);
      await page.expectToMatch('@link-b', 'Page B', true);
      await page.expectToMatch('@link-c', 'Page C', true);
    });

    tester.test('navigate to Page A', async () => {
      await check('a');
    });

    tester.test('navigate to Page B', async () => {
      await check('b');
    });

    tester.test('navigate to Page C', async () => {
      await check('c');
    });

    tester.test('Fuzzy test', async () => {
      const page = await tester.getPage();
      await page.navigate(url);
      await page.click('@link-b');
      await page.expectToMatch('@text', 'B');
      await page.click('@link-c');
      await page.expectToMatch('@text', 'C');
      await page.goBack();
      await page.expectToMatch('@text', 'B');
      await page.expectUrlToMatch('/page-b');
      await page.goBack();
      await page.expectToMatch('@text', 'A');
      await page.expectUrlToMatch('/');
      await page.goForward();
      await page.goForward();
      await page.expectToMatch('@text', 'C');
      await page.expectUrlToMatch('/page-c');
    });
  },
} as TestConfiguration;
