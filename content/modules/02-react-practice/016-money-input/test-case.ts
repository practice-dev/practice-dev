import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    function _test(input: number, expected: string) {
      tester.test('Test ' + input, async () => {
        await tester.getPage().clear(`@money-input`);
        await tester.getPage().focus(`@money-input`);
        await tester
          .getPage()
          .expectAttribute(`@money-input`, 'type', 'number');
        await tester.getPage().type(`@money-input`, input.toString());
        await tester.getPage().click(`body`);
        await tester.getPage().expectToMatch(`@money-input`, expected, true);
      });
    }

    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify input is visible.', async () => {
      await tester.getPage().expectToBeVisible(`@money-input`);
      await tester.getPage().expectToMatch(`@money-input`, '', true);
    });

    tester.test('Type 1', async () => {
      await tester.getPage().focus(`@money-input`);
      await tester.getPage().expectAttribute(`@money-input`, 'type', 'number');
      await tester.getPage().type(`@money-input`, `1`);
      await tester.getPage().click(`body`);
      await tester.getPage().expectToMatch(`@money-input`, '$1', true);
    });

    tester.test('Type 1234', async () => {
      await tester.getPage().focus(`@money-input`);
      await tester.getPage().type(`@money-input`, `234`);
      await tester.getPage().click(`body`);
      await tester.getPage().expectToMatch(`@money-input`, '$1,234', true);
    });

    tester.test('Type .56', async () => {
      await tester.getPage().focus(`@money-input`);
      await tester.getPage().type(`@money-input`, `.56`);
      await tester.getPage().click(`body`);
      await tester.getPage().expectToMatch(`@money-input`, '$1,234.56', true);
    });

    tester.test('Delete 4.56', async () => {
      await tester.getPage().focus(`@money-input`);
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().click(`body`);
      await tester.getPage().expectToMatch(`@money-input`, '$123', true);
    });

    tester.test('Clear input', async () => {
      await tester.getPage().clear(`@money-input`);
      await tester.getPage().click(`body`);
      await tester.getPage().expectToMatch(`@money-input`, '', true);
    });

    (
      [
        [0, '$0'],
        [10, '$10'],
        [12, '$12'],
        [12.34, '$12.34'],
        [91.91, '$91.91'],
        [-99, '($99)'],
        [0.0001, '$0.0001'],
        [1000, '$1,000'],
        [-1000, '($1,000)'],
        [10000, '$10,000'],
        [100000, '$100,000'],
        [100000.123, '$100,000.123'],
        [-100000.123, '($100,000.123)'],
        [-123456789, '($123,456,789)'],
        [-1234567890, '($1,234,567,890)'],
        [100000000000000, '$100,000,000,000,000'],
      ] as const
    ).forEach(([input, expected]) => {
      _test(input, expected);
    });
  },
} as TestConfiguration;
