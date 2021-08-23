import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    async function assertRules(...arr: string[]) {
      for (let i = 1; i <= 4; i++) {
        await tester
          .getPage()
          .expectToMatch(`@rule-${i} @result`, arr[i - 1], true);
      }
    }

    async function assertStrength(strength: string) {
      await tester.getPage().expectToMatch(`@strength`, strength, true);
    }

    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify rules are set to NO.', async () => {
      await assertRules('NO', 'NO', 'NO', 'NO');
    });

    tester.test('Verify strength is WEAK.', async () => {
      await assertStrength('WEAK');
    });

    tester.test('Enter `a`.', async () => {
      await tester.getPage().type('@pass', 'a');
      await assertRules('YES', 'NO', 'NO', 'NO');
      await assertStrength('WEAK');
    });

    tester.test('Enter `abcdef`.', async () => {
      await tester.getPage().clear('@pass');
      await tester.getPage().type('@pass', 'abcdef');
      await assertRules('YES', 'NO', 'NO', 'NO');
      await assertStrength('WEAK');
    });

    tester.test('Enter `ab33`.', async () => {
      await tester.getPage().clear('@pass');
      await tester.getPage().type('@pass', 'ab33');
      await assertRules('YES', 'YES', 'NO', 'NO');
      await assertStrength('MEDIUM');
    });

    tester.test('Enter `33!!!`.', async () => {
      await tester.getPage().clear('@pass');
      await tester.getPage().type('@pass', '33!!!');
      await assertRules('NO', 'YES', 'YES', 'NO');
      await assertStrength('MEDIUM');
    });

    tester.test('Enter `12345678`.', async () => {
      await tester.getPage().clear('@pass');
      await tester.getPage().type('@pass', '12345678');
      await assertRules('NO', 'YES', 'NO', 'YES');
      await assertStrength('MEDIUM');
    });

    tester.test('Enter `12345678a`.', async () => {
      await tester.getPage().clear('@pass');
      await tester.getPage().type('@pass', '12345678a');
      await assertRules('YES', 'YES', 'NO', 'YES');
      await assertStrength('MEDIUM');
    });

    tester.test('Enter `!12345678a`.', async () => {
      await tester.getPage().clear('@pass');
      await tester.getPage().type('@pass', '!12345678a');
      await assertRules('YES', 'YES', 'YES', 'YES');
      await assertStrength('STRONG');
    });

    tester.test('Enter `12345678` and press BACKSPACE.', async () => {
      await tester.getPage().clear('@pass');
      await tester.getPage().type('@pass', '12345678');
      await assertStrength('MEDIUM');
      await tester.getPage().keyboardPress('Backspace');
      await assertRules('NO', 'YES', 'NO', 'NO');
      await assertStrength('WEAK');
    });
  },
} as TestConfiguration;
