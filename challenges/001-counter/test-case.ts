import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test(
      'verify count label, increase and decrease buttons are visible',
      async () => {
        await tester.getPage().expectToBeVisible('@count-value');
        await tester.getPage().expectToBeVisible('@increase-btn');
        await tester.getPage().expectToBeVisible('@decrease-btn');
      }
    );

    tester.test('count should display 0 by default', async () => {
      await tester.getPage().expectToMatch('@count-value', '0', true);
    });

    tester.test('click increment button 3 times', async () => {
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count-value', '1', true);
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count-value', '2', true);
      await tester.getPage().click('@increase-btn');
      await tester.getPage().expectToMatch('@count-value', '3', true);
    });

    tester.test('click decrement button 2 times', async () => {
      await tester.getPage().click('@decrease-btn');
      await tester.getPage().expectToMatch('@count-value', '2', true);
      await tester.getPage().click('@decrease-btn');
      await tester.getPage().expectToMatch('@count-value', '1', true);
    });
  },
} as TestConfiguration;
