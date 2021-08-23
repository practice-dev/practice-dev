import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify `locked` is displayed.', async () => {
      await tester.getPage().expectToMatch(`@result`, 'locked', true);
    });

    tester.test('Type `unlockplease`.', async () => {
      await tester.getPage().keyboardType('unlockplease');
      await tester.getPage().expectToMatch(`@result`, 'unlocked', true);
    });

    tester.test('Type `unlockplease` with 500ms delay.', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToMatch(`@result`, 'locked', true);
      await tester.getPage().keyboardType('unlock');
      await tester.wait(500);
      await tester.getPage().keyboardType('please');
      await tester.getPage().expectToMatch(`@result`, 'unlocked', true);
    });

    tester.test('Type `unlockplease` with multiple delays.', async () => {
      await tester.getPage().keyboardType('un');
      await tester.wait(300);
      await tester.getPage().keyboardType('l');
      await tester.wait(300);
      await tester.getPage().keyboardType('ock');
      await tester.wait(400);
      await tester.getPage().keyboardType('p');
      await tester.wait(300);
      await tester.getPage().keyboardType('lease');
      await tester.getPage().expectToMatch(`@result`, 'unlocked', true);
    });

    tester.test('Type `unlockplease` with 1100ms delay.', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToMatch(`@result`, 'locked', true);
      await tester.getPage().keyboardType('unlock');
      await tester.wait(1100);
      await tester.getPage().keyboardType('please');
      await tester.getPage().expectToMatch(`@result`, 'locked', true);
    });

    tester.test('Type `unlockpplease`', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToMatch(`@result`, 'locked', true);
      await tester.getPage().keyboardType('unlockpplease');
      await tester.getPage().expectToMatch(`@result`, 'locked', true);
    });

    tester.test('Type `unlockpleasunlockpleas`', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToMatch(`@result`, 'locked', true);
      await tester.getPage().keyboardType('unlockpleasunlockpleas');
      await tester.getPage().expectToMatch(`@result`, 'locked', true);
    });

    tester.test('Type `unlockpleasunlockpleaseunlock`', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectToMatch(`@result`, 'locked', true);
      await tester.getPage().keyboardType('unlockpleasunlockpleaseunlock');
      await tester.getPage().expectToMatch(`@result`, 'unlocked', true);
    });
  },
} as TestConfiguration;
