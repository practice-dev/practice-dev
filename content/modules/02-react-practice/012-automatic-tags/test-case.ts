import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    async function _creatTag(name: string, nr: number) {
      await tester.getPage().type(`@tag-input`, name);
      await tester.getPage().keyboardPress(`Enter`);
      await tester.getPage().expectCount(`@tag`, nr);
      await tester.getPage().expectToMatch(`@tag:nth-child(${nr})`, name);
      await tester.getPage().expectToBeFocused(`@tag-input`);
      await tester.getPage().expectToMatch(`@tag-input`, '');
    }

    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test(
      'Verify an input is displayed, and there are no tags.',
      async () => {
        await tester.getPage().expectToBeVisible(`@tag-input`);
        await tester.getPage().expectCount(`@tag`, 0);
      }
    );

    tester.test('Create tags: foo, bar, baz.', async () => {
      await _creatTag('foo', 1);
      await _creatTag('bar', 2);
      await _creatTag('baz', 3);
    });

    tester.test('Press "Backspace" to remove "baz".', async () => {
      await tester.getPage().keyboardPress(`Backspace`);
      await tester.getPage().expectCount(`@tag`, 2);
      await tester.getPage().expectToMatch(`@tag:nth-child(${1})`, 'foo');
      await tester.getPage().expectToMatch(`@tag:nth-child(${2})`, 'bar');
      await tester.getPage().expectToBeFocused(`@tag-input`);
    });

    tester.test('Press "Backspace" to remove "bar".', async () => {
      await tester.getPage().keyboardPress(`Backspace`);
      await tester.getPage().expectCount(`@tag`, 1);
      await tester.getPage().expectToMatch(`@tag:nth-child(${1})`, 'foo');
    });

    tester.test('Press "Backspace" to remove "foo".', async () => {
      await tester.getPage().keyboardPress(`Backspace`);
      await tester.getPage().expectCount(`@tag`, 0);
    });

    tester.test(
      'Pressing multiple times "Backspace" should do nothing',
      async () => {
        await tester.getPage().keyboardPress(`Backspace`);
        await tester.getPage().keyboardPress(`Backspace`);
        await tester.getPage().keyboardPress(`Backspace`);
        await tester.getPage().expectCount(`@tag`, 0);
      }
    );

    tester.test('Try to create empty tags', async () => {
      await tester.getPage().keyboardPress(`Enter`);
      await tester.getPage().expectCount(`@tag`, 0);
      await tester.getPage().type(`@tag-input`, '   ');
      await tester.getPage().keyboardPress(`Enter`);
      await tester.getPage().expectCount(`@tag`, 0);
      await tester.getPage().clear(`@tag-input`);
    });

    tester.test('Create tags: foo, bar.', async () => {
      await _creatTag('foo', 1);
      await _creatTag('bar', 2);
    });

    tester.test(
      'Type "1234" and delete it by pressing "Backspace"',
      async () => {
        await tester.getPage().type(`@tag-input`, '1234');
        await tester.getPage().keyboardPress(`Backspace`);
        await tester.getPage().expectCount(`@tag`, 2);
        await tester.getPage().keyboardPress(`Backspace`);
        await tester.getPage().expectCount(`@tag`, 2);
        await tester.getPage().keyboardPress(`Backspace`);
        await tester.getPage().expectCount(`@tag`, 2);
        await tester.getPage().keyboardPress(`Backspace`);
        await tester.getPage().expectCount(`@tag`, 2);
      }
    );

    tester.test(
      'Type "1234", move cursor to the beginning, and press "Backspace"',
      async () => {
        await tester.getPage().type(`@tag-input`, '1234');
        await tester.getPage().keyboardPress(`ArrowLeft`);
        await tester.getPage().keyboardPress(`ArrowLeft`);
        await tester.getPage().keyboardPress(`ArrowLeft`);
        await tester.getPage().keyboardPress(`ArrowLeft`);
        await tester.getPage().expectCount(`@tag`, 2);
        await tester.getPage().keyboardPress(`Backspace`);
        await tester.getPage().expectCount(`@tag`, 1);
      }
    );

    tester.test('Move cursor and press Backspace', async () => {
      await tester.getPage().keyboardPress(`ArrowRight`);
      await tester.getPage().keyboardPress(`Backspace`);
      await tester.getPage().expectCount(`@tag`, 1);
      await tester.getPage().keyboardPress(`Backspace`);
      await tester.getPage().expectCount(`@tag`, 0);
    });
  },
} as TestConfiguration;
