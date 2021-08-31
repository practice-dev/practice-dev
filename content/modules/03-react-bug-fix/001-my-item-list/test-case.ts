import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test(
      'Verify default tags, input and button are displayed.',
      async () => {
        await tester.getPage().expectCount(`@item`, 2);
        await tester.getPage().expectToMatch(`@item:nth-child(${1})`, 'pen');
        await tester.getPage().expectToMatch(`@item:nth-child(${2})`, 'wheel');
        await tester.getPage().expectToBeVisible(`@item-input`);
        await tester.getPage().expectToBeVisible(`@add-btn`);
      }
    );

    tester.test(
      'Verify default tags, input and button are displayed.',
      async () => {
        await tester.getPage().expectCount(`@item`, 2);
        await tester.getPage().expectToMatch(`@item:nth-child(${1})`, 'pen');
        await tester.getPage().expectToMatch(`@item:nth-child(${2})`, 'wheel');
        await tester.getPage().expectToBeVisible(`@item-input`);
        await tester.getPage().expectToBeVisible(`@add-btn`);
      }
    );

    tester.test('Add "cat" item.', async () => {
      await tester.getPage().type(`@item-input`, 'cat');
      await tester.getPage().click(`@add-btn`);
      await tester.getPage().expectCount(`@item`, 3);
      await tester.getPage().expectToMatch(`@item:nth-child(${1})`, 'pen');
      await tester.getPage().expectToMatch(`@item:nth-child(${2})`, 'wheel');
      await tester.getPage().expectToMatch(`@item:nth-child(${3})`, 'cat');
      await tester.getPage().expectToMatch(`@item-input`, '');
    });

    tester.test('Try to add an empty item.', async () => {
      await tester.getPage().expectToMatch(`@item-input`, '');
      await tester.getPage().click(`@add-btn`);
      await tester.getPage().expectCount(`@item`, 3);
    });

    tester.test('Add "dog" item.', async () => {
      await tester.getPage().type(`@item-input`, 'dog');
      await tester.getPage().click(`@add-btn`);
      await tester.getPage().expectCount(`@item`, 4);
      await tester.getPage().expectToMatch(`@item:nth-child(${1})`, 'pen');
      await tester.getPage().expectToMatch(`@item:nth-child(${2})`, 'wheel');
      await tester.getPage().expectToMatch(`@item:nth-child(${3})`, 'cat');
      await tester.getPage().expectToMatch(`@item:nth-child(${4})`, 'dog');
      await tester.getPage().expectToMatch(`@item-input`, '');
    });
  },
} as TestConfiguration;
