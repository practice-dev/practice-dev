import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    async function _verify(states: boolean[]) {
      const count = states.filter(x => x).length;
      await tester.getPage().expectCount(`@light.active`, count);
      for (let i = 1; i <= 6; i++) {
        if (states[i - 1]) {
          await tester
            .getPage()
            .expectToHaveClass(`@light:nth-child(${i})`, 'active');
        }
      }
    }
    async function _expectActive(btn: number) {
      if (btn) {
        await tester.getPage().expectCount(`@toggle-btn.active`, 1);
        await tester
          .getPage()
          .expectToHaveClass(`@toggle-btn:nth-child(${btn})`, 'active');
      } else {
        await tester.getPage().expectCount(`@toggle-btn.active`, 0);
      }
    }

    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify lights and buttons are visible.', async () => {
      await tester.getPage().expectCount(`@light`, 6);
      await tester.getPage().expectCount(`@light.active`, 0);
      await tester.getPage().expectCount(`@toggle-btn`, 5);
      await tester.getPage().expectCount(`@toggle-btn.active`, 0);
      await tester.getPage().expectToMatch(`@light:nth-child(${1})`, 'A', true);
      await tester.getPage().expectToMatch(`@light:nth-child(${2})`, 'B', true);
      await tester.getPage().expectToMatch(`@light:nth-child(${3})`, 'C', true);
      await tester.getPage().expectToMatch(`@light:nth-child(${4})`, 'D', true);
      await tester.getPage().expectToMatch(`@light:nth-child(${5})`, 'E', true);
      await tester.getPage().expectToMatch(`@light:nth-child(${6})`, 'F', true);
      await tester
        .getPage()
        .expectToMatch(`@toggle-btn:nth-child(${1})`, 1, true);
      await tester
        .getPage()
        .expectToMatch(`@toggle-btn:nth-child(${2})`, 2, true);
      await tester
        .getPage()
        .expectToMatch(`@toggle-btn:nth-child(${3})`, 3, true);
      await tester
        .getPage()
        .expectToMatch(`@toggle-btn:nth-child(${4})`, 4, true);
      await tester
        .getPage()
        .expectToMatch(`@toggle-btn:nth-child(${5})`, 5, true);
      await tester.getPage().expectToBeVisible(`@suggest-btn`);
    });

    tester.test('Click suggest button.', async () => {
      await tester.getPage().click(`@suggest-btn`);
      await _expectActive(1);
    });

    tester.test('Click button 1 and suggest.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${1})`);
      await _verify([false, true, false, false, true, false]);
      await _expectActive(0);
      await tester.getPage().click(`@suggest-btn`);
      await _expectActive(2);
    });

    tester.test('Click button 2 and suggest.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${2})`);
      await _verify([false, false, true, true, true, false]);
      await _expectActive(0);
      await tester.getPage().click(`@suggest-btn`);
      await _expectActive(5);
    });

    tester.test('Click button 5.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${5})`);
      await _verify([true, true, true, true, true, true]);
      await _expectActive(0);
      await tester.getPage().expectToBeDisabled(`@suggest-btn`);
    });

    tester.test('Click buttons 3 and 4.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${3})`);
      await tester.getPage().click(`@toggle-btn:nth-child(${4})`);
      await _verify([false, true, true, true, false, false]);
      await _expectActive(0);
    });

    tester.test('Click suggest button.', async () => {
      await tester.getPage().click(`@suggest-btn`);
      await _expectActive(1);
    });

    tester.test('Click button 3 and suggest.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${3})`);
      await _verify([true, true, true, true, false, true]);
      await tester.getPage().click(`@suggest-btn`);
      await _expectActive(4);
    });

    tester.test('Reload page.', async () => {
      await tester.getPage().reload();
      await tester.getPage().expectCount(`@light`, 6);
    });

    tester.test('Click buttons 1, 2, 5, 3.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${1})`);
      await tester.getPage().click(`@toggle-btn:nth-child(${2})`);
      await tester.getPage().click(`@toggle-btn:nth-child(${5})`);
      await tester.getPage().expectToBeDisabled(`@suggest-btn`);
      await tester.getPage().click(`@toggle-btn:nth-child(${3})`);
      await tester.getPage().expectToBeEnabled(`@suggest-btn`);
      await _verify([false, true, true, true, true, false]);
    });

    tester.test('Click suggest button.', async () => {
      await tester.getPage().click(`@suggest-btn`);
      await _expectActive(3);
    });
  },
} as TestConfiguration;
