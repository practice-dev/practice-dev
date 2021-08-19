import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify all categories are displayed', async () => {
      for (let i = 1; i <= 16; i++) {
        await tester.getPage().expectToBeVisible('@category-' + i);
      }
    });

    tester.test('Verify the order of categories.', async () => {
      await tester.getPage().expectToBeVisible('@root > @category-1');
      await tester.getPage().expectToBeVisible('@root > @category-2');
      await tester
        .getPage()
        .expectToBeVisible('@category-1 @category-3 @category-9');
      await tester
        .getPage()
        .expectToBeVisible('@category-4 @category-11 @category-14');
      await tester.getPage().expectToBeVisible('@category-2 @category-5');
      await tester.getPage().expectToBeVisible('@category-2 @category-6');
    });

    tester.test(
      'Nodes with children should have an expand button.',
      async () => {
        for (const id of [1, 2, 3, 4, 11]) {
          await tester
            .getPage()
            .expectToBeVisible(`@category-${id} > @toggle-btn`);
        }
      }
    );

    tester.test(
      'Nodes without children should not have an expand button.',
      async () => {
        for (const id of [8, 10, 14, 5, 6]) {
          await tester
            .getPage()
            .expectToBeHidden(`@category-${id} @toggle-btn`);
        }
      }
    );

    tester.test('Collapse "Personal Computer".', async () => {
      await tester
        .getPage()
        .expectToMatch('@category-11 > @toggle-btn', '-', true);
      await tester.getPage().click('@category-11 > @toggle-btn');
      await tester
        .getPage()
        .expectToMatch('@category-11 > @toggle-btn', '+', true);
      await tester.getPage().expectToBeHidden('@category-14');
      await tester.getPage().expectToBeHidden('@category-15');
      await tester.getPage().expectToBeHidden('@category-16');

      await tester.getPage().expectToBeVisible('@category-12');
      await tester.getPage().expectToBeVisible('@category-13');
    });

    tester.test('Collapse "Computers".', async () => {
      await tester.getPage().click('@category-4 > @toggle-btn');
      await tester.getPage().expectToBeHidden('@category-12');
      await tester.getPage().expectToBeHidden('@category-13');
    });

    tester.test('Expand "Computers".', async () => {
      await tester.getPage().click('@category-4 > @toggle-btn');
      await tester.getPage().expectToBeVisible('@category-14');
      await tester.getPage().expectToBeVisible('@category-12');
      await tester.getPage().expectToBeVisible('@category-13');
    });

    tester.test('Collapse "Electronics".', async () => {
      await tester.getPage().click('@category-1 > @toggle-btn');
      await tester.getPage().expectToBeHidden('@category-3');
      await tester.getPage().expectToBeHidden('@category-14');
      await tester.getPage().expectToBeHidden('@category-13');
    });

    tester.test('Collapse "Fashion".', async () => {
      await tester.getPage().click('@category-2 > @toggle-btn');
      await tester.getPage().expectToBeHidden('@category-5');
      await tester.getPage().expectToBeHidden('@category-6');
    });

    tester.test('Expand "Electronics".', async () => {
      await tester.getPage().click('@category-1 > @toggle-btn');
      await tester.getPage().expectToBeVisible('@category-3');
      await tester.getPage().expectToBeVisible('@category-14');
      await tester.getPage().expectToBeVisible('@category-13');
    });

    tester.test('Collapse "Accessories".', async () => {
      await tester.getPage().click('@category-3 > @toggle-btn');
      await tester.getPage().expectToBeHidden('@category-8');
      await tester.getPage().expectToBeHidden('@category-9');
      await tester.getPage().expectToBeHidden('@category-10');
    });
  },
} as TestConfiguration;
