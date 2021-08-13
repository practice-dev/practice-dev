import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test(
      'Verify the add button and the iframe container are visible.',
      async () => {
        await tester.getPage().expectToBeVisible('@add-btn');
        await tester.getPage().expectToBeVisible('@iframes');
      }
    );

    tester.test('There should be no iframes on page load.', async () => {
      await tester.getPage().expectCount('@iframes iframe', 0);
      await tester.getPage().expectToBeHidden('@iframes iframe');
    });

    tester.test('Add 6 iframes', async () => {
      const contents: string[] = [];
      const assertSrc = (nr: number) =>
        tester
          .getPage()
          .expectAttribute(
            `@iframes iframe:nth-child(${nr})`,
            'src',
            'https://unstable-iframe.netlify.app'
          );
      const getContent = (nr: number) =>
        tester
          .getPage()
          .getIframeElementContent(
            `@iframes iframe:nth-child(${nr})`,
            '#number'
          );

      const assertContents = async () => {
        for (let i = 1; i <= contents.length; i++) {
          const actual = await getContent(i);
          await tester.expectEqual(actual, contents[i - 1], 'iframe ' + i);
        }
      };

      for (let i = 1; i <= 6; i++) {
        await tester.getPage().click('@add-btn');
        await tester.getPage().expectCount('@iframes iframe', i);
        await assertSrc(1);
        const content = await getContent(1);
        tester.notify(`new iframe displays \`${content}\``);
        contents.unshift(content);
        await assertContents();
      }
    });
  },
} as TestConfiguration;
