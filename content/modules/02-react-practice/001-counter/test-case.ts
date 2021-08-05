import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test(
      'Verify the count label and the decrease button are visible.',
      async () => {
        await tester.getPage().expectToBeVisible('@count');
        await tester.getPage().expectToBeVisible('@increase-btn');
      }
    );

    tester.test('The count should be equal to 0 by default.', async () => {
      await tester.getPage().expectToMatch('@count', '0', true);
    });

    tester.test('Click the increment button 3 times.', async () => {
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count', '1', true);
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count', '2', true);
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count', '3', true);
    });
  },
} as TestConfiguration;
