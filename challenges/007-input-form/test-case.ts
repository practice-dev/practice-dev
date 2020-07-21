import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('type: 1234', async () => {
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().keyboardType('1234');
      await tester.getPage().expectToMatch('@pin', '1234');
    });

    tester.test('type: 23g4x5', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().keyboardType('23g4x5');
      await tester.getPage().expectToMatch('@pin', '2345');
    });

    tester.test('type: 23 Backspace 789', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().keyboardType('23');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardType('789');
      await tester.getPage().expectToMatch('@pin', '2789');
    });

    tester.test('type: 123 Backspace Backspace Backspace 7777', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().keyboardType('123');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardType('7777');
      await tester.getPage().expectToMatch('@pin', '7777');
    });

    tester.test('type: 23g Backspace 789', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().keyboardType('23g');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardType('789');
      await tester.getPage().expectToMatch('@pin', '2789');
    });

    tester.test('type: 123, focus i-1, type 7777', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().keyboardType('123');
      await tester.getPage().focus('@i-1 input');
      await tester.getPage().keyboardType('7777');
      await tester.getPage().expectToMatch('@pin', '7777');
    });

    tester.test('type: 123, focus i-1, type Backspace 7777', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().keyboardType('123');
      await tester.getPage().focus('@i-1 input');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardType('7777');
      await tester.getPage().expectToMatch('@pin', '7777');
    });

    tester.test('type: 1, focus i-4, type 234', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().keyboardType('1');
      await tester.getPage().focus('@i-4 input');
      await tester.getPage().keyboardType('234');
      await tester.getPage().expectToMatch('@pin', '1342');
    });

    tester.test('focus i-4, type 4123', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().focus('@i-4 input');
      await tester.getPage().keyboardType('4123');
      await tester.getPage().expectToMatch('@pin', '1234');
    });

    tester.test('focus i-4, type Backspace 4123', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToBeVisible('@i-1');
      await tester.getPage().focus('@i-4 input');
      await tester.getPage().keyboardPress('Backspace');
      await tester.getPage().keyboardType('4123');
      await tester.getPage().expectToMatch('@pin', '2341');
    });
  },
} as TestConfiguration;
