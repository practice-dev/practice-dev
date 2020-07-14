import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('verify a note input and buttons are visible', async () => {
      await tester.getPage().expectToBeVisible('@note input');
      await tester.getPage().expectToBeVisible('@save-btn');
      await tester.getPage().expectToBeVisible('@load-btn');
    });

    tester.test('a note should be empty by default', async () => {
      await tester.getPage().expectToMatch('@note input', '', true);
    });

    tester.test('enter the note and save it', async () => {
      await tester.getPage().type('@note input', 'foo');
      await tester.getPage().click('@save-btn');
      await tester.getPage().expectToBeEnabled('@save-btn');
    });

    tester.test('refresh the page and load the note', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToMatch('@note input', '', true);
      await tester.getPage().click('@load-btn');
      await tester.getPage().expectToBeEnabled('@load-btn');
      await tester.getPage().expectToMatch('@note input', 'foo', true);
    });

    tester.test('edit the note and save it', async () => {
      await tester.getPage().type('@note input', 'bar');
      await tester.getPage().click('@save-btn');
      await tester.getPage().expectToBeEnabled('@save-btn');
    });

    tester.test('create a new browser context and load the note', async () => {
      await tester.createPage(2, 2);
      await tester.getPage(2).navigate(url);
      await tester.getPage(2).click('@load-btn');
      await tester.getPage(2).expectToBeEnabled('@load-btn');
      await tester.getPage(2).expectToMatch('@note input', 'foobar', true);
    });
  },
} as TestConfiguration;
