import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    async function fill(selector: string, text: string, clear?: boolean) {
      await tester.getPage().click(selector);
      if (clear) {
        await tester.getPage().clear(selector + ` input`);
      }
      await tester.getPage().type(selector + ` input`, text);
      await tester.getPage().keyboardPress('Enter');
    }

    function simpleTest(selector: string, formula: string, result: string) {
      tester.test(
        `Enter \`${formula}\` into ${selector.substr(1)}.`,
        async () => {
          await fill(selector, formula);
          await tester.getPage().expectToMatch(selector, result, true);
        }
      );
    }

    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify cells are displayed.', async () => {
      await tester.getPage().expectToBeVisible(`@A1`);
      await tester.getPage().expectToBeVisible(`@B1`);
      await tester.getPage().expectToBeVisible(`@C1`);
      await tester.getPage().expectToBeVisible(`@A3`);
      await tester.getPage().expectToBeVisible(`@B4`);
      await tester.getPage().expectToBeVisible(`@C5`);
      await tester.getPage().expectToBeVisible(`@A6`);
      await tester.getPage().expectToBeVisible(`@B7`);
      await tester.getPage().expectToBeVisible(`@C7`);
      await tester.getPage().expectToBeHidden(`@A1 input`);
      await tester.getPage().expectToBeHidden(`@B1 input`);
      await tester.getPage().expectToBeHidden(`@C2 input`);
    });

    tester.test('Enter `foo` into A1.', async () => {
      await tester.getPage().click(`@A1`);
      await tester.getPage().expectToBeVisible(`@A1 input`);
      await tester.getPage().expectToBeFocused(`@A1 input`);
      await tester.getPage().type(`@A1 input`, 'foo');
      await tester.getPage().keyboardPress('Enter');
      await tester.getPage().expectToBeHidden(`@A1 input`);
      await tester.getPage().expectToMatch(`@A1`, 'foo', true);
      await tester.getPage().click(`@A1`);
      await tester.getPage().expectToMatch(`@A1 input`, 'foo', true);
      await tester.getPage().click(`body`);
      await tester.getPage().expectToBeHidden(`@A1 input`);
      await tester.getPage().expectToMatch(`@A1`, 'foo', true);
    });

    simpleTest('@A2', '=2', '2');
    simpleTest('@A3', '=1+1', '2');
    simpleTest('@A4', '=10 * 2', '20');
    simpleTest('@A5', '=10/2', '5');
    simpleTest('@A6', '=-1+1', '0');
    simpleTest('@A7', '=10000/10000', '1');
    simpleTest('@B1', '=2+2*2', '6');
    simpleTest('@B2', '=(2+2)*2', '8');
    simpleTest('@B3', '=1+2*3/6', '2');
    simpleTest('@B4', '=(1+2) * ((5 + 1)+1)', '21');
    simpleTest('@B5', '=-1*(1+2)*7+((1+1)+1)', '-18');
    simpleTest('@C1', '=1-2', '-1');
    simpleTest('@C2', '=2-1', '1');
    simpleTest('@C3', '=-20-11', '-31');
    simpleTest('@C4', '=1-2-3', '-4');

    tester.test('Div by 0.', async () => {
      await tester.getPage().reload();
      await fill('@A1', '=3/0');
      await tester.getPage().expectToMatch('@A1', '#ERR', true);
      await fill('@A2', '=(1-1)/(2-2)');
      await tester.getPage().expectToMatch('@A2', '#ERR', true);
      await fill('@A3', '=5/((2 * 2)-4)');
      await tester.getPage().expectToMatch('@A3', '#ERR', true);
    });

    tester.test('Invalid formulas.', async () => {
      await tester.getPage().reload();
      await fill('@A1', '=3//0');
      await tester.getPage().expectToMatch('@A1', '#ERR', true);
      await fill('@A2', '=***');
      await tester.getPage().expectToMatch('@A2', '#ERR', true);
      await fill('@A3', '=avc');
      await tester.getPage().expectToMatch('@A3', '#ERR', true);
      await fill('@A4', '=11e,.34');
      await tester.getPage().expectToMatch('@A4', '#ERR', true);
    });

    tester.test('Simple references.', async () => {
      await tester.getPage().reload();
      await fill('@A1', '=1+2');
      await fill('@A2', '3');
      await fill('@A3', '=A2+1');
      await fill('@A4', '=A3+1');
      await tester.getPage().expectToMatch('@A3', '4', true);
      await tester.getPage().expectToMatch('@A4', '5', true);
      await fill('@A2', '4', true);
      await tester.getPage().expectToMatch('@A3', '5', true);
      await tester.getPage().expectToMatch('@A4', '6', true);
    });

    tester.test('Invalid references.', async () => {
      await tester.getPage().reload();
      await fill('@A1', '=A2+1');
      await tester.getPage().expectToMatch('@A1', '#ERR', true);
      await fill('@A2', '5');
      await tester.getPage().expectToMatch('@A1', '6', true);
      await fill('@A2', 'a', true);
      await tester.getPage().expectToMatch('@A1', '#ERR', true);
    });

    tester.test('Reference cycles.', async () => {
      await tester.getPage().reload();
      await fill('@A1', '1');
      await fill('@A2', '=A1+1');
      await fill('@A3', '=A2+1');
      await fill('@A4', '=A3+1');
      await fill('@A5', '=A4+1');
      await fill('@A6', '=A5+1');
      await fill('@A7', '=A6+1');
      await fill('@B1', '=B1+1');
      await tester.getPage().expectToMatch('@A7', '7', true);
      await tester.getPage().expectToMatch('@B1', '#ERR', true);
      await fill('@A1', '=A7+1', true);
      await tester.getPage().expectToMatch('@A1', '#ERR', true);
      await tester.getPage().expectToMatch('@A2', '#ERR', true);
      await tester.getPage().expectToMatch('@A3', '#ERR', true);
      await tester.getPage().expectToMatch('@A4', '#ERR', true);
      await tester.getPage().expectToMatch('@A5', '#ERR', true);
      await tester.getPage().expectToMatch('@A6', '#ERR', true);
      await tester.getPage().expectToMatch('@A7', '#ERR', true);
      await fill('@A1', '=A3+1', true);
      await tester.getPage().expectToMatch('@A1', '#ERR', true);
      await tester.getPage().expectToMatch('@A2', '#ERR', true);
      await tester.getPage().expectToMatch('@A3', '#ERR', true);
      await tester.getPage().expectToMatch('@A4', '#ERR', true);
      await tester.getPage().expectToMatch('@A5', '#ERR', true);
      await tester.getPage().expectToMatch('@A6', '#ERR', true);
      await tester.getPage().expectToMatch('@A7', '#ERR', true);
      await fill('@A4', '1', true);
      await tester.getPage().expectToMatch('@A1', '#ERR', true);
      await tester.getPage().expectToMatch('@A2', '#ERR', true);
      await tester.getPage().expectToMatch('@A3', '#ERR', true);
      await tester.getPage().expectToMatch('@A4', '1', true);
      await tester.getPage().expectToMatch('@A5', '2', true);
      await tester.getPage().expectToMatch('@A6', '3', true);
      await tester.getPage().expectToMatch('@A7', '4', true);
    });

    tester.test('Complex references.', async () => {
      await tester.getPage().reload();
      await fill('@A1', '=(1+2)*2');
      await fill('@A2', '=A1+1');
      await fill('@A3', '=A1+A2');
      await fill('@A4', '=A3-A5');
      await fill('@A5', '=6');
      await fill('@A6', '=(A1+A1-3)*2');
      await fill('@A7', '=(A1+A2)+(A3+A4)+(A5+A6)');
      await tester.getPage().expectToMatch('@A1', '6', true);
      await tester.getPage().expectToMatch('@A2', '7', true);
      await tester.getPage().expectToMatch('@A3', '13', true);
      await tester.getPage().expectToMatch('@A4', '7', true);
      await tester.getPage().expectToMatch('@A5', '6', true);
      await tester.getPage().expectToMatch('@A6', '18', true);
      await tester.getPage().expectToMatch('@A7', '57', true);
    });

    tester.test('Fibonacci sequence.', async () => {
      await tester.getPage().reload();
      await fill('@A1', '1');
      await fill('@A2', '1');
      await fill('@A3', '=A1+A2');
      await fill('@A4', '=A2+A3');
      await fill('@A5', '=A3+A4');
      await fill('@A6', '=A4+A5');
      await fill('@A7', '=A5+A6');
      await fill('@B1', '=A6+A7');
      await fill('@B2', '=A7+B1');
      await fill('@B3', '=B1+B2');
      await fill('@B4', '=B2+B3');
      await fill('@B5', '=B3+B4');
      await fill('@B6', '=B4+B5');
      await fill('@B7', '=B5+B6');

      await tester.getPage().expectToMatch('@A5', '5', true);
      await tester.getPage().expectToMatch('@A7', '13', true);
      await tester.getPage().expectToMatch('@B1', '21', true);
      await tester.getPage().expectToMatch('@B4', '89', true);
      await tester.getPage().expectToMatch('@B7', '377', true);
    });

    tester.test('Long references', async () => {
      await tester.getPage().reload();
      const paths = [
        'A1',
        'A2',
        'A3',
        'A4',
        'A5',
        'A6',
        'A7',
        'B1',
        'B2',
        'B3',
        'B4',
        'B5',
        'B6',
        'B7',
        'C1',
      ];
      const last = '@' + paths[paths.length - 1];
      for (let i = 0; i < paths.length - 1; i++) {
        const current = paths[i];
        const next = paths[i + 1];
        await fill('@' + current, `=${next}+${next}`);
      }
      await tester.getPage().expectToMatch('@A1', '#ERR', true);
      await fill(last, `1`);
      await tester.getPage().expectToMatch('@A1', '16384', true);
      await fill(last, `5`, true);
      await tester.getPage().expectToMatch('@A1', '81920', true);
    });
  },
} as TestConfiguration;
