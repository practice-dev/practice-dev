import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify the count and buttons are visible.', async () => {
      await tester.getPage().expectToMatch('@count', 0, true);
      await tester.getPage().expectToBeVisible('@increase-btn');
      await tester.getPage().expectToBeVisible('@decrease-btn');
      await tester.getPage().expectToBeVisible('@reset-btn');
    });

    tester.test('Increase 3 times.', async () => {
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count', 1, true);
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count', 2, true);
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count', 3, true);
    });

    tester.test('Decrease 2 times.', async () => {
      await tester.getPage().click('@decrease-btn');
      await tester.getPage().expectToMatch('@count', 2, true);
      await tester.getPage().click('@decrease-btn');
      await tester.getPage().expectToMatch('@count', 1, true);
    });

    tester.test('Reset count.', async () => {
      await tester.getPage().click('@reset-btn');
      await tester.getPage().expectToMatch('@count', 0, true);
    });

    tester.test('Various actions.', async () => {
      await tester.getPage().click('@increase-btn');
      await tester.getPage().click('@increase-btn');
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count', 3, true);
      await tester.getPage().click('@reset-btn');
      await tester.getPage().expectToMatch('@count', 0, true);
      await tester.getPage().click('@decrease-btn');
      await tester.getPage().expectToMatch('@count', -1, true);
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count', 0, true);
    });
  },
} as TestConfiguration;
