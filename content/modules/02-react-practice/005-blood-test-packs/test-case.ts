import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    async function assertSummary(total: number, pack: string, save: number) {
      await tester.getPage().expectToMatch('@total', '$' + total, true);
      await tester.getPage().expectToMatch('@pack', pack, true);
      await tester.getPage().expectToMatch('@save', '$' + save, true);
    }
    async function clickTest(...ids: number[]) {
      for (const id of ids) {
        await tester.getPage().click('@test-' + id);
      }
    }

    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify blood tests are displayed.', async () => {
      for (let i = 1; i <= 25; i++) {
        await tester.getPage().expectToBeVisible('@test-' + i);
      }
    });

    tester.test('Verify prices are correct.', async () => {
      const items = [
        ['Complete blood count $5', 1],
        ['CRP $15', 6],
        ['Electrolytes (Na, K) $15', 10],
        ['AST $5', 18],
        ['Testosterone $20', 20],
        ['PSA $30', 25],
      ] as const;
      for (const [text, i] of items) {
        await tester.getPage().expectToMatch('@test-' + i, text, true);
      }
    });

    tester.test('Verify default summary values.', async () => {
      await assertSummary(0, '-', 0);
    });

    tester.test('Select TSH, FT3', async () => {
      await clickTest(14, 15);
      await assertSummary(30, 'Thyroid', 5);
    });

    tester.test('Select FT4', async () => {
      await clickTest(16);
      await assertSummary(45, 'Thyroid', 20);
    });

    tester.test('Unselect FT3, FT4', async () => {
      await clickTest(15, 16);
      await assertSummary(15, '-', 0);
    });

    tester.test(
      'Select complete blood count, ESR, Glucose, Creatinine, CRP',
      async () => {
        await clickTest(1, 2, 3, 4, 6);
        await assertSummary(56, 'Active minimum', 11);
      }
    );

    tester.test('Select total cholesterol, HDL, LDL', async () => {
      await clickTest(7, 8, 9);
      await assertSummary(86, 'Active minimum', 21);
    });

    tester.test('Select Magnesium, ALT, AST', async () => {
      await clickTest(12, 17, 18);
      await assertSummary(104, 'Active maximum', 29);
    });

    tester.test(
      'Select Testosterone, FSH, LH, Estradiol, Prolactin',
      async () => {
        await clickTest(20, 21, 22, 23, 24);
        await assertSummary(204, 'Woman hormones', 30);
      }
    );

    tester.test('Unselect FSH, LH, Estradiol, Prolactin', async () => {
      await clickTest(21, 22, 23, 24);
      await assertSummary(124, 'Active maximum', 29);
    });

    tester.test('Unselect AST', async () => {
      await clickTest(18);
      await assertSummary(119, 'Active minimum', 26);
    });

    tester.test('Select PSA', async () => {
      await clickTest(25);
      await assertSummary(149, 'For man', 28);
    });

    tester.test(
      'Unselect creatinine, CRP, Magnesium, ALT, Testosterone, PSA',
      async () => {
        await clickTest(4, 6, 12, 17, 20, 25);
        await assertSummary(63, 'For woman', 3);
      }
    );
    tester.test('Select estradiol', async () => {
      await clickTest(23);
      await assertSummary(83, 'For woman', 23);
    });
  },
} as TestConfiguration;
