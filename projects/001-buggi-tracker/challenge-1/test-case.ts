import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });
    tester.test('login page should be displayed by default', async () => {
      await tester.getPage().expectToBeVisible('@username input');
      await tester.getPage().expectToBeVisible('@password input');
      await tester.getPage().expectToBeVisible('@login-btn');
    });
    tester.test('verify login form validation', async () => {
      await tester.getPage().click('@login-btn');
      await tester
        .getPage()
        .expectToMatch('@username @error', 'Username is required');
      await tester
        .getPage()
        .expectToMatch('@password @error', 'Password is required');
    });
    tester.test('should display error if username does not exist', async () => {
      await tester.getPage().reload();
      await tester.getPage().type('@username input', 'foo');
      await tester.getPage().type('@password input', 'passa1');
      await tester.getPage().click('@login-btn');
      await tester
        .getPage()
        .expectToMatch('@login-error', 'Authentication failed');
    });
    tester.test('should display error if password is invalid', async () => {
      await tester.getPage().reload();
      await tester.getPage().type('@username input', 'admin');
      await tester.getPage().type('@password input', 'passa');
      await tester.getPage().click('@login-btn');
      await tester
        .getPage()
        .expectToMatch('@login-error', 'Authentication failed');
    });
    tester.test('fix password and log in as admin', async () => {
      await tester.getPage().type('@password input', '1');
      await tester.getPage().click('@login-btn');
      await tester.getPage().expectToBeHidden('@login-error');
      await tester
        .getPage()
        .expectToMatch('@header-username', `Hello admin`, true);
    });

    tester.test(
      'admin should be still logged in after page refresh',
      async () => {
        await tester.getPage().reload();
        await tester
          .getPage()
          .expectToMatch('@header-username', `Hello admin`, true);
      }
    );

    ['admin', 'AdmiN', 'owner1', 'owner2', 'reporter1', 'reporter2'].forEach(
      username => {
        tester.test(`log in as ${username}`, async () => {
          await tester.createPage(username, username);
          const page = await tester.getPage(username);
          await page.navigate(url);
          await page.type('@username input', username);
          await page.type('@password input', 'passa1');
          await page.click('@login-btn');
          await page.expectToBeHidden('@login-btn');
          await page.expectToMatch(
            '@header-username',
            `Hello ${username.toLowerCase()}`,
            true
          );
          await page.expectToMatch('@placeholder', 'home page placeholder');
        });
      }
    );

    tester.test('login as owner1, logout and login as reporter2', async () => {
      await tester.createPage('relogin', 'relogin');
      const page = await tester.getPage('relogin');
      await page.navigate(url);
      await page.type('@username input', 'owner1');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToMatch('@header-username', `Hello owner1`, true);
      await page.click('@logout-btn');
      await page.expectToBeHidden('@placeholder');
      await page.expectToMatch('@username input', '', true);
      await page.expectToMatch('@password input', '', true);
      await page.type('@username input', 'reporter2');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToMatch('@header-username', `Hello reporter2`, true);
    });
  },
} as TestConfiguration;
