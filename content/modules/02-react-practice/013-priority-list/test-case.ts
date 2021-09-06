import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    async function _create(name: string, priority: number, promo?: boolean) {
      await tester.getPage().type(`@name-input`, name);
      await tester.getPage().type(`@priority-input`, priority.toString());
      if (promo) {
        await tester.getPage().click(`@promo-checkbox`);
      }
      await tester.getPage().click(`@add-btn`);
    }

    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test(
      'Verify an inputs are displayed, and there are no tags.',
      async () => {
        await tester.getPage().expectToBeVisible(`@name-input`);
        await tester.getPage().expectToBeVisible(`@priority-input`);
        await tester.getPage().expectToBeVisible(`@promo-checkbox`);
        await tester.getPage().expectToBeVisible(`@add-btn`);
        await tester.getPage().expectCount(`@item`, 0);
        await tester.getPage().expectToMatch(`@name-input`, '', true);
        await tester.getPage().expectToMatch(`@priority-input`, '', true);
        await tester.getPage().expectToBeChecked(`@promo-checkbox`, false);
      }
    );

    tester.test('Add "* cat (200)"', async () => {
      await _create('cat', 200, true);
      await tester.getPage().expectCount(`@item`, 1);
      await tester.getPage().expectToMatch(`@name-input`, '', true);
      await tester.getPage().expectToMatch(`@priority-input`, '', true);
      await tester.getPage().expectToBeChecked(`@promo-checkbox`, false);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${1})`, '* cat (200)', true);
    });

    tester.test('Add "* aba (200)"', async () => {
      await _create('aba', 200, true);
      await tester.getPage().expectCount(`@item`, 2);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${1})`, '* aba (200)', true);
    });

    tester.test('Add "* zaba (100)"', async () => {
      await _create('zaba', 100, true);
      await tester.getPage().expectCount(`@item`, 3);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${3})`, '* zaba (100)', true);
    });

    tester.test('Add "cat (50)"', async () => {
      await _create('cat', 50, false);
      await tester.getPage().expectCount(`@item`, 4);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${4})`, 'cat (50)', true);
    });

    tester.test('Add "cat2 (50)"', async () => {
      await _create('cat2', 50, false);
      await tester.getPage().expectCount(`@item`, 5);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${5})`, 'cat2 (50)', true);
    });

    tester.test('Add "scooter (500)"', async () => {
      await _create('scooter', 500, false);
      await tester.getPage().expectCount(`@item`, 6);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${4})`, 'scooter (500)', true);
    });

    tester.test('Add "aka (500)"', async () => {
      await _create('aka', 500, false);
      await tester.getPage().expectCount(`@item`, 7);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${4})`, 'aka (500)', true);
    });

    tester.test('Add "* aka (500)"', async () => {
      await _create('aka', 500, true);
      await tester.getPage().expectCount(`@item`, 8);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${1})`, '* aka (500)', true);
    });

    tester.test('verify final order', async () => {
      const items = [
        '* aka (500)',
        '* aba (200)',
        '* cat (200)',
        '* zaba (100)',
        'aka (500)',
        'scooter (500)',
        'cat (50)',
        'cat2 (50)',
      ];
      for (let i = 0; i < items.length; i++) {
        await tester
          .getPage()
          .expectToMatch(`@item:nth-child(${i + 1})`, items[i], true);
      }
    });
  },
} as TestConfiguration;
