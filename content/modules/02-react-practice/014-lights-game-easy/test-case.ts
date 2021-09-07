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

    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('Verify lights and buttons are visible.', async () => {
      await tester.getPage().expectCount(`@light`, 6);
      await tester.getPage().expectCount(`@light.active`, 0);
      await tester.getPage().expectCount(`@toggle-btn`, 5);
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
    });

    tester.test('Click button 2.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${2})`);
      await _verify([false, true, true, true, false, false]);
    });

    tester.test('Click button 4.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${4})`);
      await _verify([false, true, true, true, true, false]);
    });

    tester.test('Click button 5.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${5})`);
      await _verify([true, false, true, true, true, true]);
    });

    tester.test('Click button 4.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${4})`);
      await _verify([true, false, true, true, false, true]);
    });

    tester.test('Click button 1.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${1})`);
      await _verify([true, true, true, true, true, true]);
    });

    tester.test('Click button 3.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${3})`);
      await _verify([false, true, true, true, true, false]);
    });

    tester.test('Click button 3.', async () => {
      await tester.getPage().click(`@toggle-btn:nth-child(${3})`);
      await _verify([true, true, true, true, true, true]);
    });
  },
} as TestConfiguration;
