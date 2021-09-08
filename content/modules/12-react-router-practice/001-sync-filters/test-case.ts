import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    async function _click(section: 'color' | 'size' | 'shape', i: number) {
      await tester
        .getPage()
        .click(`@${section} @item:nth-child(${i}) input[type="checkbox"]`);
    }

    async function _expectChecked(
      section: 'color' | 'size' | 'shape',
      i: number,
      checked: boolean
    ) {
      await tester
        .getPage()
        .expectToBeChecked(
          `@${section} @item:nth-child(${i}) input[type="checkbox"]`,
          checked
        );
    }

    async function _expectTotalChecked(count: number) {
      await tester
        .getPage()
        .expectCount('@item input[type="checkbox"]:checked', count);
    }

    tester.test('Verify checkboxes are visible.', async () => {
      await tester
        .getPage()
        .expectCount('@color @item input[type="checkbox"]', 4);
      await tester
        .getPage()
        .expectCount('@color @item input[type="checkbox"]:checked', 0);
      await tester
        .getPage()
        .expectCount('@size @item input[type="checkbox"]', 3);
      await tester
        .getPage()
        .expectCount('@size @item input[type="checkbox"]:checked', 0);
      await tester
        .getPage()
        .expectCount('@shape @item input[type="checkbox"]', 2);
      await tester
        .getPage()
        .expectCount('@shape @item input[type="checkbox"]:checked', 0);

      await tester
        .getPage()
        .expectToMatch(`@color @item:nth-child(${1})`, 'Red', true);
      await tester
        .getPage()
        .expectToMatch(`@color @item:nth-child(${4})`, 'Orange', true);
      await tester
        .getPage()
        .expectToMatch(`@size @item:nth-child(${1})`, 'Large', true);
      await tester
        .getPage()
        .expectToMatch(`@size @item:nth-child(${2})`, 'Medium', true);
      await tester
        .getPage()
        .expectToMatch(`@shape @item:nth-child(${1})`, 'Square', true);
      await tester
        .getPage()
        .expectToMatch(`@shape @item:nth-child(${2})`, 'Circle', true);
    });

    tester.test('Check "Red" and reload the page.', async () => {
      await _click('color', 1);
      await _expectChecked('color', 1, true);
      await _expectTotalChecked(1);
      await tester.getPage().clearData();
      await tester.getPage().reload();
      await _expectChecked('color', 1, true);
      await _expectTotalChecked(1);
    });

    tester.test('Go back and forward.', async () => {
      await tester.getPage().goBack();
      await _expectTotalChecked(0);
      await tester.getPage().goForward();
      await _expectTotalChecked(1);
      await _expectChecked('color', 1, true);
    });

    tester.test(
      'Check "Green", "Blue", "Large" and reload the page.',
      async () => {
        await _click('color', 2);
        await _click('color', 3);
        await _click('size', 1);
        await _expectTotalChecked(4);
        await tester.getPage().reload();
        await _expectChecked('color', 1, true);
        await _expectChecked('color', 2, true);
        await _expectChecked('color', 3, true);
        await _expectChecked('size', 1, true);
      }
    );

    tester.test('Go back and uncheck "Blue".', async () => {
      await tester.getPage().goBack();
      await _click('color', 3);
      await _expectTotalChecked(2);
      await _expectChecked('size', 1, false);
      await _expectChecked('color', 3, false);
    });

    tester.test('Check "Square", "Circle" and refresh the page.', async () => {
      await _click('shape', 1);
      await _click('shape', 2);
      await _expectTotalChecked(4);
      await _expectChecked('shape', 1, true);
      await _expectChecked('shape', 2, true);
    });

    tester.test('Go back 6 times.', async () => {
      await tester.getPage().goBack();
      await _expectTotalChecked(3);
      await tester.getPage().goBack();
      await _expectTotalChecked(2);
      await tester.getPage().goBack();
      await _expectTotalChecked(3);
      await tester.getPage().goBack();
      await _expectTotalChecked(2);
      await tester.getPage().goBack();
      await _expectTotalChecked(1);
      await tester.getPage().goBack();
      await _expectTotalChecked(0);
    });

    tester.test('Go forward 6 times.', async () => {
      await tester.getPage().goForward();
      await _expectTotalChecked(1);
      await tester.getPage().goForward();
      await _expectTotalChecked(2);
      await tester.getPage().goForward();
      await _expectTotalChecked(3);
      await tester.getPage().goForward();
      await _expectTotalChecked(2);
      await tester.getPage().goForward();
      await _expectTotalChecked(3);
      await tester.getPage().goForward();
      await _expectTotalChecked(4);
    });
  },
} as TestConfiguration;
