import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    async function _checkSuggest(email: string, expected: string) {
      tester.test(
        `It should suggest "${expected}" when entering "${email}".`,
        async () => {
          await tester.getPage().clear(`@email-input`);
          await tester.getPage().type(`@email-input`, email);
          await tester.getPage().expectToMatch(`@email`, expected, true);
        }
      );
    }

    async function _checkNotSuggest(email: string) {
      tester.test(
        `It should not suggest when entering "${email}".`,
        async () => {
          await tester.getPage().clear(`@email-input`);
          await tester.getPage().type(`@email-input`, email);
          await tester.getPage().expectToBeHidden(`@suggestion`);
          await tester.getPage().expectToBeHidden(`@email`);
        }
      );
    }

    tester.test('Verify an input is displayed.', async () => {
      await tester.getPage().expectToBeVisible(`@email-input`);
      await tester.getPage().expectToBeHidden(`@suggestion`);
      await tester.getPage().expectToBeHidden(`@email`);
    });

    tester.test('Enter a valid email "user1@gmail.com"', async () => {
      await tester.getPage().type(`@email-input`, 'user1');
      await tester.getPage().expectToBeHidden(`@suggestion`);
      await tester.getPage().type(`@email-input`, '@gmail');
      await tester.getPage().expectToBeHidden(`@suggestion`);
      await tester.getPage().type(`@email-input`, '.');
      await tester.getPage().expectToBeHidden(`@suggestion`);
      await tester.getPage().type(`@email-input`, 'com');
      await tester.getPage().expectToBeHidden(`@suggestion`);
    });

    tester.test('Enter "user1@gmail.co" and and apply suggestion', async () => {
      await tester.getPage().clear(`@email-input`);
      await tester.getPage().type(`@email-input`, 'user1@gmail.co');
      await tester.getPage().expectToBeVisible(`@suggestion`);
      await tester.getPage().expectToMatch(`@email`, 'user1@gmail.com', true);
      await tester.getPage().click(`@email`);
      await tester.getPage().expectToBeHidden(`@suggestion`);
      await tester
        .getPage()
        .expectToMatch(`@email-input`, 'user1@gmail.com', true);
    });

    _checkSuggest('u@gmai.com', 'u@gmail.com');
    _checkSuggest('u@gmal.com', 'u@gmail.com');
    _checkSuggest('u@gmil.com', 'u@gmail.com');
    _checkSuggest('u@gail.com', 'u@gmail.com');
    _checkSuggest('u@mail.com', 'u@gmail.com');
    _checkSuggest('u@gmail.co', 'u@gmail.com');
    _checkSuggest('u@gmal.co', 'u@gmail.com');
    _checkSuggest('u@gmal.abcdef', 'u@gmail.com');
    _checkSuggest('u@gmailx.com', 'u@gmail.com');
    _checkSuggest('u@xgmail.com', 'u@gmail.com');
    _checkSuggest('u@gxmail.com', 'u@gmail.com');
    _checkSuggest('u@gxmail.co', 'u@gmail.com');
    _checkSuggest('u@gxmail.cox', 'u@gmail.com');
    _checkSuggest('u@yaho.com', 'u@yahoo.com');
    _checkSuggest('u@yah0o.com', 'u@yahoo.com');
    _checkSuggest('u@outlok.com', 'u@outlook.com');
    _checkSuggest('u@outook.com', 'u@outlook.com');

    _checkNotSuggest('u@gml.com');
    _checkNotSuggest('gmail.comx');
    _checkNotSuggest('u@gmaxx.com');
    _checkNotSuggest('u@gmailll.com');
    _checkNotSuggest('u@gxxil.com');
    _checkNotSuggest('u@xgmxail.com');
    _checkNotSuggest('u@custom.com');
    _checkNotSuggest('u@gmail.abc.com');
    _checkNotSuggest('u@abc');
    _checkNotSuggest('u@abc.gmai.com');
  },
} as TestConfiguration;
