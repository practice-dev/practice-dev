import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify `-` is displayed.', async () => {
      await tester.getPage().expectToMatch(`@consent`, '-', true);
    });

    tester.test('Verify Accept and Reject buttons are displayed.', async () => {
      await tester.getPage().expectToBeVisible(`@alert`);
      await tester.getPage().expectToBeVisible(`@accept-btn`);
      await tester.getPage().expectToBeVisible(`@reject-btn`);
    });

    tester.test('Click on Accept.', async () => {
      await tester.getPage().click('@accept-btn');
      await tester.getPage().expectToBeHidden(`@alert`);
      await tester.getPage().expectToMatch(`@consent`, 'Yes', true);
    });

    tester.test('Refresh the page.', async () => {
      await tester.getPage().expectToMatch(`@consent`, 'Yes', true);
      await tester.getPage().expectToBeHidden(`@alert`);
    });

    tester.test('Clear website data and reload.', async () => {
      await tester.getPage().clearData();
      await tester.getPage().reload();
      await tester.getPage().expectToMatch(`@consent`, '-', true);
      await tester.getPage().expectToBeVisible(`@alert`);
    });

    tester.test('Click on Reject.', async () => {
      await tester.getPage().click('@reject-btn');
      await tester.getPage().expectToBeHidden(`@alert`);
      await tester.getPage().expectToMatch(`@consent`, 'No', true);
    });

    tester.test('Refresh the page.', async () => {
      await tester.getPage().expectToMatch(`@consent`, 'No', true);
      await tester.getPage().expectToBeHidden(`@alert`);
    });
  },
} as TestConfiguration;
