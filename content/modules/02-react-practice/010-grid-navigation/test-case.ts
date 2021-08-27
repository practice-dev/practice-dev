import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    async function _expectActive(cell: number) {
      await tester.getPage().expectToHaveClass(`@cell-${cell}`, 'active');
      await tester.getPage().expectCount('.active', 1);
    }

    async function _press(...keys: string[]) {
      for (const key of keys) {
        await tester.getPage().keyboardPress(key);
      }
    }

    tester.test('Verify cells are displayed.', async () => {
      await tester.getPage().expectToBeVisible(`@cell-1`);
      await tester.getPage().expectToBeVisible(`@cell-2`);
      await tester.getPage().expectToBeVisible(`@cell-3`);
      await tester.getPage().expectToBeVisible(`@cell-4`);
      await tester.getPage().expectToBeVisible(`@cell-20`);
      await tester.getPage().expectToBeVisible(`@cell-21`);
      await tester.getPage().expectToBeVisible(`@cell-30`);
      await tester.getPage().expectToBeVisible(`@cell-32`);
      await tester.getPage().expectToBeVisible(`@cell-36`);
      await tester.getPage().expectToMatch(`@cell-1`, '1', true);
      await tester.getPage().expectToMatch(`@cell-2`, '2', true);
      await tester.getPage().expectToMatch(`@cell-21`, '21', true);
      await tester.getPage().expectToMatch(`@cell-36`, '36', true);
    });

    tester.test('Verify cell 1 is focused by default.', async () => {
      await _expectActive(1);
    });

    tester.test('Navigate to cell 4.', async () => {
      await tester.getPage().keyboardPress('ArrowRight');
      await _expectActive(2);
      await tester.getPage().keyboardPress('ArrowRight');
      await _expectActive(3);
      await tester.getPage().keyboardPress('ArrowRight');
      await _expectActive(4);
    });

    tester.test('Navigate to cell 28.', async () => {
      await tester.getPage().keyboardPress('ArrowDown');
      await _expectActive(10);
      await tester.getPage().keyboardPress('ArrowDown');
      await _expectActive(16);
      await tester.getPage().keyboardPress('ArrowDown');
      await _expectActive(22);
      await tester.getPage().keyboardPress('ArrowDown');
      await _expectActive(28);
    });

    tester.test('Navigate to cell 26.', async () => {
      await tester.getPage().keyboardPress('ArrowLeft');
      await _expectActive(27);
      await tester.getPage().keyboardPress('ArrowLeft');
      await _expectActive(26);
    });

    tester.test('Navigate to cell 2.', async () => {
      await tester.getPage().keyboardPress('ArrowUp');
      await _expectActive(20);
      await tester.getPage().keyboardPress('ArrowUp');
      await _expectActive(14);
      await tester.getPage().keyboardPress('ArrowUp');
      await _expectActive(8);
      await tester.getPage().keyboardPress('ArrowUp');
      await _expectActive(2);
    });

    tester.test('Try to go through the top border.', async () => {
      await _press('ArrowUp');
      await _expectActive(2);
      await _press('ArrowUp');
      await _expectActive(2);
      await _press('ArrowUp');
      await _expectActive(2);
      await _press('ArrowUp');
      await _expectActive(2);
      await _press('ArrowDown');
      await _expectActive(8);
      await _press('ArrowUp');
      await _expectActive(2);
    });

    tester.test('Try to go through the left border.', async () => {
      await _press('ArrowLeft');
      await _expectActive(1);
      await _press('ArrowLeft');
      await _expectActive(1);
      await _press('ArrowLeft');
      await _expectActive(1);
      await _press('ArrowLeft');
      await _expectActive(1);
      await _press('ArrowRight');
      await _expectActive(2);
      await _press('ArrowLeft');
      await _expectActive(1);
    });

    tester.test('Try to go through the right border.', async () => {
      await _press(
        'ArrowRight',
        'ArrowRight',
        'ArrowRight',
        'ArrowRight',
        'ArrowRight'
      );
      await _expectActive(6);
      await _press('ArrowRight');
      await _expectActive(6);
      await _press('ArrowRight');
      await _expectActive(6);
      await _press('ArrowRight');
      await _expectActive(6);
      await _press('ArrowLeft');
      await _expectActive(5);
      await _press('ArrowRight');
      await _expectActive(6);
    });

    tester.test('Try to go through the bottom border.', async () => {
      await _press(
        'ArrowDown',
        'ArrowDown',
        'ArrowDown',
        'ArrowDown',
        'ArrowDown'
      );
      await _expectActive(36);
      await _press('ArrowDown');
      await _expectActive(36);
      await _press('ArrowDown');
      await _expectActive(36);
      await _press('ArrowDown');
      await _expectActive(36);
      await _press('ArrowDown');
      await _expectActive(36);
      await _press('ArrowUp');
      await _expectActive(30);
      await _press('ArrowDown');
      await _expectActive(36);
    });

    tester.test('Mixed movements', async () => {
      await _press(
        'ArrowLeft',
        'ArrowLeft',
        'ArrowUp',
        'ArrowLeft',
        'ArrowLeft',
        'ArrowLeft',
        'ArrowLeft',
        'ArrowLeft',
        'ArrowLeft'
      );
      await _expectActive(25);
      await _press('ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowUp');
      await _expectActive(14);
      await _press(
        'ArrowRight',
        'ArrowRight',
        'ArrowRight',
        'ArrowUp',
        'ArrowUp',
        'ArrowUp'
      );
      await _expectActive(5);
    });
  },
} as TestConfiguration;
