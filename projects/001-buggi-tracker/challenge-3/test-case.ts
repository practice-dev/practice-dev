import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      const page = await tester.getPage();
      await page.navigate(url);
    });

    tester.test('login as admin (admin context)', async () => {
      const page = await tester.getPage();
      await page.type('@username input', 'admin');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToBeVisible('@home-card-users');
      await page.expectToBeVisible('@home-card-projects');
    });

    tester.test(
      'open projects page and verify there are no projects',
      async () => {
        const page = await tester.getPage();
        await page.click('@home-card-projects');
        await page.expectToMatch('@bc-1', 'Home', true);
        await page.expectToMatch('@bc-2', 'Projects', true);
        await page.expectToBeVisible('@add-project-btn');
        await page.reload();
        await page.expectToBeVisible('@add-project-btn');
        await page.expectToBeHidden('@name-1');
      }
    );

    tester.test('create "p1" project', async () => {
      const page = await tester.getPage();
      await page.click('@add-project-btn');
      await page.expectToMatch('@bc-1', 'Home', true);
      await page.expectToMatch('@bc-2', 'Projects', true);
      await page.expectToMatch('@bc-3', 'Add Project', true);
      await page.reload();
      await page.expectToMatch('@bc-3', 'Add Project', true);
      await page.expectToBeHidden('@name @error');
      await page.expectToBeHidden('@owner @error');
      await page.expectToBeHidden('@add-member @error');
      await page.expectToBeHidden('@member-1');
      await page.click('@save-btn');
      await page.expectToMatch('@name @error', 'Name is required', true);
      await page.expectToMatch('@owner @error', 'Owner is required', true);
      await page.expectToBeHidden('@add-member @error');
      await page.click('@add-member-btn');
      await page.expectToMatch(
        '@add-member @error',
        'Member is required',
        true
      );
      await page.expectToHaveOption('@owner select', 'owner1');
      await page.expectToHaveOption('@owner select', 'owner2');
      await page.expectToNotHaveOption('@owner select', 'admin');
      await page.expectToNotHaveOption('@owner select', 'reporter1');
      await page.expectToNotHaveOption('@owner select', 'reporter2');
      await page.expectToHaveOption('@add-member select', 'reporter1');
      await page.expectToHaveOption('@add-member select', 'reporter2');
      await page.expectToNotHaveOption('@add-member select', 'admin');
      await page.expectToNotHaveOption('@add-member select', 'owner1');
      await page.expectToNotHaveOption('@add-member select', 'owner2');
      await page.type('@name input', 'p1');
      await page.select('@owner select', 'owner1');
      await page.select('@add-member select', 'reporter1');
      await page.click('@add-member-btn');
      await page.expectSelectedText('@add-member select', 'select');
      await page.expectToMatch('@member-1', 'reporter1', true);
      await page.expectToNotHaveOption('@add-member select', 'reporter1');
      await page.click('@del-member-btn-1');
      await page.expectToHaveOption('@add-member select', 'reporter1');
      await page.select('@add-member select', 'reporter1');
      await page.click('@add-member-btn');
      await page.click('@save-btn');
      await page.expectToMatch('@name-1', 'p1');
      await page.expectToMatch('@owner-1', 'owner1');
      await page.expectToBeVisible('@delete-btn-1');
      await page.expectToBeVisible('@edit-btn-1');
    });

    tester.test('create "p2" project', async () => {
      const page = await tester.getPage();
      await page.click('@add-project-btn');
      await page.type('@name input', 'p2');
      await page.select('@owner select', 'owner1');
      await page.select('@add-member select', 'reporter1');
      await page.click('@add-member-btn');
      await page.select('@add-member select', 'reporter2');
      await page.click('@add-member-btn');
      await page.expectToMatch('@member-1', 'reporter1', true);
      await page.expectToMatch('@member-2', 'reporter2', true);
      await page.click('@save-btn');
      await page.expectToMatch('@name-1', 'p1');
      await page.expectToMatch('@owner-1', 'owner1');
      await page.expectToMatch('@name-2', 'p2');
      await page.expectToMatch('@owner-2', 'owner1');
    });

    tester.test('login as owner1 (owner1 context)', async () => {
      await tester.createPage('owner1', 'owner1');
      const page = await tester.getPage('owner1');
      await page.navigate(url);
      await page.type('@username input', 'owner1');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToBeVisible('@home-card-projects');
      await page.expectToBeHidden('@home-card-users');
    });

    tester.test('verify owner1 can see "p1" and "p2" projects', async () => {
      const page = await tester.getPage('owner1');
      await page.click('@home-card-projects');
      await page.expectToMatch('@name-1', 'p1', true);
      await page.expectToMatch('@owner-1', 'owner1', true);
      await page.expectToMatch('@name-2', 'p2', true);
      await page.expectToMatch('@owner-2', 'owner1', true);
      await page.expectToBeVisible('@edit-btn-1');
      await page.expectToBeVisible('@edit-btn-2');
      await page.expectToBeHidden('@delete-btn-1');
      await page.expectToBeHidden('@delete-btn-2');
    });

    tester.test('create "p3" project', async () => {
      const page = await tester.getPage('owner1');
      await page.click('@add-project-btn');
      await page.type('@name input', 'p3');
      await page.expectSelectedText('@owner select', 'owner1');
      await page.expectToBeDisabled('@owner select');
      await page.click('@save-btn');
      await page.expectToMatch('@name-3', 'p3', true);
      await page.expectToMatch('@owner-3', 'owner1', true);
    });

    tester.test('edit "p3" project', async () => {
      const page = await tester.getPage('owner1');
      await page.click('@edit-btn-3');
      await page.expectToBeDisabled('@owner select');
      await page.select('@add-member select', 'reporter1');
      await page.click('@add-member-btn');
      await page.click('@save-btn');
      await page.expectToMatch('@name-3', 'p3', true);
    });

    tester.test('login as reporter1 (reporter1 context)', async () => {
      await tester.createPage('reporter1', 'reporter1');
      const page = await tester.getPage('reporter1');
      await page.navigate(url);
      await page.type('@username input', 'reporter1');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToBeVisible('@home-card-projects');
      await page.expectToBeHidden('@home-card-users');
    });

    tester.test(
      'verify reporter1 can see "p1", "p2" and "p3" projects',
      async () => {
        const page = await tester.getPage('reporter1');
        await page.click('@home-card-projects');
        await page.expectToMatch('@name-1', 'p1', true);
        await page.expectToMatch('@owner-1', 'owner1', true);
        await page.expectToMatch('@name-2', 'p2', true);
        await page.expectToMatch('@owner-2', 'owner1', true);
        await page.expectToBeHidden('@edit-btn-1');
        await page.expectToBeHidden('@edit-btn-2');
        await page.expectToBeHidden('@edit-btn-3');
        await page.expectToBeHidden('@delete-btn-1');
        await page.expectToBeHidden('@delete-btn-2');
        await page.expectToBeHidden('@delete-btn-3');
      }
    );

    tester.test('login as reporter2 (reporter2 context)', async () => {
      await tester.createPage('reporter2', 'reporter2');
      const page = await tester.getPage('reporter2');
      await page.navigate(url);
      await page.type('@username input', 'reporter2');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToBeVisible('@home-card-projects');
      await page.expectToBeHidden('@home-card-users');
    });

    tester.test('verify reporter2 can see only "p1" project', async () => {
      const page = await tester.getPage('reporter2');
      await page.click('@home-card-projects');
      await page.expectToMatch('@name-1', 'p2', true);
      await page.expectToMatch('@owner-1', 'owner1', true);
      await page.expectToBeHidden('@edit-btn-1');
      await page.expectToBeHidden('@delete-btn-1');
      await page.expectToBeHidden('@name-2');
    });

    tester.test('as admin, change "p1" owner to owner2', async () => {
      const page = await tester.getPage();
      await page.click('@edit-btn-1');
      await page.expectSelectedText('@owner select', 'owner1');
      await page.select('@owner select', 'owner2');
      await page.click('@save-btn');
      await page.expectToMatch('@owner-1', 'owner2', true);
    });

    tester.test('as admin, delete "p3" project', async () => {
      const page = await tester.getPage();
      await page.click('@delete-btn-3');
      await page.expectToMatch('@modal @desc', 'Are you sure to delete "p3"?');
      await page.click('@modal @yes-btn');
      await page.expectToBeHidden('@name-3');
    });

    tester.test('verify owner1 can see only "p2" project', async () => {
      const page = await tester.getPage('owner1');
      page.reload();
      await page.expectToMatch('@name-1', 'p2', true);
      await page.expectToMatch('@owner-1', 'owner1', true);
      await page.expectToBeVisible('@edit-btn-1');
      await page.expectToBeHidden('@delete-btn-1');
      await page.expectToBeHidden('@name-2');
    });

    tester.test('login as owner2 (owner2 context)', async () => {
      await tester.createPage('owner2', 'owner2');
      const page = await tester.getPage('owner2');
      await page.navigate(url);
      await page.type('@username input', 'owner2');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToBeVisible('@home-card-projects');
      await page.expectToBeHidden('@home-card-users');
    });

    tester.test('verify owner2 can see only "p1" project', async () => {
      const page = await tester.getPage('owner2');
      await page.click('@home-card-projects');
      await page.expectToMatch('@name-1', 'p1', true);
      await page.expectToMatch('@owner-1', 'owner2', true);
      await page.expectToBeVisible('@edit-btn-1');
      await page.expectToBeHidden('@delete-btn-1');
      await page.expectToBeHidden('@name-2');
    });

    tester.test('as owner2, edit "p1" project', async () => {
      const page = await tester.getPage('owner2');
      await page.click('@edit-btn-1');
      await page.expectToMatch('@name input', 'p1', true);
      await page.type('@name input', ' - edited');
      await page.click('@del-member-btn-1');
      await page.click('@save-btn');
      await page.expectToMatch('@name-1', 'p1 - edited', true);
    });
  },
} as TestConfiguration;
