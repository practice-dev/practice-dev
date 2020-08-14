import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    const add = async (text: string) => {
      const page = await tester.getPage();
      await page.click('@add-btn');
      await page.type('@modal @name input', text);
      await page.click('@modal @save-btn');
      await page.expectToBeHidden('@modal');
    };

    const rename = async (i: number, text: string) => {
      const page = await tester.getPage();
      await page.click('@edit-btn-' + i);
      await page.expectToBeVisible('@modal');
      await page.clear('@modal @name input');
      await page.type('@modal @name input', text);
      await page.click('@modal @save-btn');
    };

    tester.test('add foo', async () => {
      const page = await tester.getPage();
      await page.expectToBeVisible('@add-btn');
      await page.expectToBeHidden('@name-1');
      await page.click('@add-btn');
      await page.expectToBeVisible('@modal');
      await page.expectToMatch('@modal @title', 'Add Layout', true);
      await page.type('@modal @name input', 'foo');
      await page.click('@modal @save-btn');
    });

    tester.test('open modal and cancel', async () => {
      const page = await tester.getPage();
      await page.click('@add-btn');
      await page.type('@modal @name input', 'foo');
      await page.click('@modal @cancel-btn');
      await page.expectToBeHidden('@modal');
    });

    tester.test('add bar', async () => {
      const page = await tester.getPage();
      await add('bar');
      await page.expectToMatch('@name-2', 'bar', true);
    });

    tester.test('add foo', async () => {
      const page = await tester.getPage();
      await add('foo');
      await page.expectToMatch('@name-3', 'foo-2', true);
    });

    tester.test('add foo-3', async () => {
      const page = await tester.getPage();
      await add('foo-3');
      await page.expectToMatch('@name-4', 'foo-3', true);
    });

    tester.test('add foo', async () => {
      const page = await tester.getPage();
      await add('foo');
      await page.expectToMatch('@name-5', 'foo-4', true);
    });

    tester.test('delete foo-3', async () => {
      const page = await tester.getPage();
      await page.click('@delete-btn-4');
      await page.expectToMatch('@name-4', 'foo-4', true);
    });

    tester.test('edit bar to foo', async () => {
      const page = await tester.getPage();
      await page.click('@edit-btn-2');
      await page.expectToBeVisible('@modal');
      await page.expectToMatch('@modal @title', 'Edit Layout', true);
      await page.expectToMatch('@modal @name input', 'bar');
      await page.clear('@modal @name input');
      await page.type('@modal @name input', 'foo');
      await page.click('@modal @save-btn');
      await page.expectToMatch('@name-2', 'foo-3', true);
    });

    tester.test('edit foo-2 to foo', async () => {
      const page = await tester.getPage();
      await rename(2, 'foo');
      await page.expectToMatch('@name-2', 'foo-3', true);
    });

    tester.test('edit foo-2 to foo-3', async () => {
      const page = await tester.getPage();
      await rename(3, 'foo-3');
      await page.expectToMatch('@name-3', 'foo-3-2', true);
    });

    tester.test('edit foo to foo', async () => {
      const page = await tester.getPage();
      await rename(1, 'foo');
      await page.expectToMatch('@name-1', 'foo', true);
    });

    tester.test('refresh the page', async () => {
      const page = await tester.getPage();
      await page.reload();
      await page.click('@add-btn');
      await page.click('@cancel-btn');
      await page.expectToBeHidden('@name-1');
    });
  },
} as TestConfiguration;
