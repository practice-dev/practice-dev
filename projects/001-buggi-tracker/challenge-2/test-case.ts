import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      const page = await tester.getPage();
      await page.navigate(url);
    });

    tester.test('login as reporter1 and verify home page', async () => {
      const page = await tester.getPage();
      await page.type('@username input', 'reporter1');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToMatch('@placeholder', 'home page placeholder', true);
      await page.click('@logout-btn');
    });

    tester.test('login as owner2 and verify home page', async () => {
      const page = await tester.getPage();
      await page.type('@username input', 'owner2');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await tester
        .getPage()
        .expectToMatch('@placeholder', 'home page placeholder', true);
      await page.click('@logout-btn');
    });

    tester.test('login as admin', async () => {
      const page = await tester.getPage();
      await page.type('@username input', 'admin');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToMatch('@home-card-1', 'Users', true);
    });

    tester.test('open Users page and verify default users', async () => {
      const page = await tester.getPage();
      await page.click('@home-card-1');
      await page.expectToMatch('@bc-1', 'Home', true);
      await page.expectToMatch('@bc-2', 'Users', true);

      await page.expectToMatch('@username-1', 'admin', true);
      await page.expectToMatch('@role-1', 'admin', true);
      await page.expectToBeHidden('@delete-btn-1');
      await page.expectToBeHidden('@edit-btn-1');

      await page.expectToMatch('@username-2', 'owner1', true);
      await page.expectToMatch('@role-2', 'owner', true);
      await page.expectToBeVisible('@delete-btn-2');
      await page.expectToBeVisible('@edit-btn-2');

      await page.expectToMatch('@username-3', 'owner2', true);
      await page.expectToMatch('@role-3', 'owner', true);
      await page.expectToBeVisible('@delete-btn-3');
      await page.expectToBeVisible('@edit-btn-3');

      await page.expectToMatch('@username-4', 'reporter1', true);
      await page.expectToMatch('@role-4', 'reporter', true);
      await page.expectToBeVisible('@delete-btn-4');
      await page.expectToBeVisible('@edit-btn-4');

      await page.expectToMatch('@username-5', 'reporter2', true);
      await page.expectToMatch('@role-5', 'reporter', true);
      await page.expectToBeVisible('@delete-btn-5');
      await page.expectToBeVisible('@edit-btn-5');

      await page.reload();
      await page.expectToMatch('@username-1', 'admin', true);
      await page.expectToMatch('@username-5', 'reporter2', true);
    });

    tester.test('add new user: Admin2', async () => {
      const page = await tester.getPage();
      await page.click('@add-user-btn');
      await page.expectToMatch('@bc-1', 'Home', true);
      await page.expectToMatch('@bc-2', 'Users', true);
      await page.expectToMatch('@bc-3', 'Add User', true);
      await page.expectToBeHidden('@username @error');
      await page.expectToBeHidden('@role @error');
      await page.reload();
      await page.expectToMatch('@bc-3', 'Add User', true);

      await page.click('@save-btn');
      await tester
        .getPage()
        .expectToMatch('@username @error', 'Username is required', true);
      await page.expectToMatch('@role @error', 'Role is required');
      await page.type('@username input', 'reporter31111111');
      await tester
        .getPage()
        .expectToMatch(
          '@username @error',
          'Username can have max 10 characters',
          true
        );
      await page.clear('@username input');
      await page.type('@username input', 'Admin');
      await page.select('@role select', 'admin');
      await page.click('@save-btn');
      await tester
        .getPage()
        .expectToMatch('@username @error', 'Username is already taken', true);
      await page.type('@username input', '2');
      await page.click('@save-btn');
      await page.expectToMatch('@username-2', 'Admin2', true);
      await page.expectToMatch('@role-2', 'admin', true);
    });

    tester.test('add new user: john', async () => {
      const page = await tester.getPage();
      await page.click('@add-user-btn');
      await page.type('@username input', 'john');
      await page.select('@role select', 'reporter');
      await page.click('@save-btn');
      await page.expectToMatch('@username-3', 'john', true);
      await page.expectToMatch('@role-3', 'reporter', true);
    });

    tester.test('log in as john (new browser context)', async () => {
      await tester.createPage('john', 'john');
      const page = await tester.getPage('john');
      await page.navigate(url);

      await page.type('@username input', 'john');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToMatch('@placeholder', 'home page placeholder', true);
      await page.expectToBeHidden('@home-card-1');
    });

    tester.test("set john's role to admin", async () => {
      const page = await tester.getPage();
      await page.click('@edit-btn-3');
      await page.expectToMatch('@bc-1', 'Home', true);
      await page.expectToMatch('@bc-2', 'Users', true);
      await page.expectToMatch('@bc-3', 'Edit User', true);
      await page.select('@role select', 'admin');
      await page.click('@save-btn');
      await page.expectToMatch('@role-3', 'admin', true);
    });

    tester.test('as john, refresh the page', async () => {
      const page = await tester.getPage('john');
      await page.reload();
      await page.expectToBeVisible('@home-card-1');
    });

    tester.test('edit owner1', async () => {
      const page = await tester.getPage();
      await page.click('@edit-btn-4');
      await page.expectToMatch('@username input', 'owner1');
      await page.expectSelectedText('@role select', 'owner');
      await page.reload();
      await page.expectToMatch('@username input', 'owner1');
      await page.expectSelectedText('@role select', 'owner');
      await page.clear('@username input');
      await page.type('@username input', 'AdMIn');
      await page.select('@role select', 'admin');
      await page.click('@save-btn');
      await tester
        .getPage()
        .expectToMatch('@username @error', 'Username is already taken', true);
      await page.clear('@username input');
      await page.type('@username input', 'Owner1');
      await page.click('@save-btn');
      await page.expectToMatch('@username-4', 'Owner1', true);
      await page.expectToMatch('@role-4', 'admin', true);
    });

    tester.test('verify breadcrumb navigation', async () => {
      const page = await tester.getPage();
      await page.click('@add-user-btn');
      await page.click('@bc-1');
      await page.goBack();
      await page.click('@bc-2');
      await page.expectToBeVisible('@add-user-btn');
      await page.click('@edit-btn-2');
      await page.click('@bc-2');
      await page.expectToBeVisible('@add-user-btn');
    });

    tester.test(
      'log in as admin2 (new browser context) and delete other users',
      async () => {
        await tester.createPage('admin2', 'admin2');
        const page = await tester.getPage('admin2');
        await page.navigate(url);
        await page.type('@username input', 'admin2');
        await page.type('@password input', 'passa1');
        await page.click('@login-btn');
        await page.click('@home-card-1');
        await page.click('@delete-btn-1');
        await page.expectToBeVisible('@modal');
        await page.expectToMatch(
          '@modal @desc',
          'Are you sure to delete "admin"'
        );
        await page.click('@modal @no-btn');
        await page.click('@delete-btn-1');
        await page.click('@modal @yes-btn');
        await page.click('@delete-btn-2');
        await page.click('@modal @yes-btn');
        await page.expectToMatch('@username-2', 'Owner1', true);
      }
    );

    tester.test(
      'it should not be possible to log in as deleted user',
      async () => {
        const page = await tester.getPage();
        await page.click('@logout-btn');
        await page.type('@username input', 'admin');
        await page.type('@password input', 'passa1');
        await page.click('@login-btn');
        await page.expectToMatch('@login-error', 'Authentication failed');
      }
    );
  },
} as TestConfiguration;
