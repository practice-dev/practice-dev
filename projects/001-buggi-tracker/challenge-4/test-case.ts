import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      const page = await tester.getPage();
      await page.navigate(url);
    });

    tester.test('login as owner1 (owner1 context)', async () => {
      const page = await tester.getPage();
      await page.type('@username input', 'owner1');
      await page.type('@password input', 'passa1');
      await page.click('@login-btn');
      await page.expectToBeVisible('@home-card-projects');
    });

    tester.test('create "p1" project', async () => {
      const page = await tester.getPage();
      await page.click('@home-card-projects');
      await page.click('@add-project-btn');
      await page.type('@name input', 'p1');
      await page.select('@owner select', 'owner1');
      await page.select('@add-member select', 'reporter1');
      await page.click('@add-member-btn');
      await page.select('@add-member select', 'reporter2');
      await page.click('@add-member-btn');
      await page.click('@save-btn');
      await page.expectToMatch('@name-1', 'p1', true);
      await page.expectToMatch('@owner-1', 'owner1', true);
      await page.expectToMatch('@issues-1', '0 open issues', true);
      await page.expectToBeHidden('@name-2');
    });

    tester.test('create "p2" project', async () => {
      const page = await tester.getPage();
      await page.click('@add-project-btn');
      await page.type('@name input', 'p2');
      await page.select('@owner select', 'owner1');
      await page.select('@add-member select', 'reporter1');
      await page.click('@add-member-btn');
      await page.click('@save-btn');
      await page.expectToMatch('@name-2', 'p2', true);
      await page.expectToMatch('@owner-2', 'owner1', true);
      await page.expectToMatch('@issues-2', '0 open issues', true);
    });

    tester.test(
      'open "p1" project and verify there are no issues',
      async () => {
        const page = await tester.getPage();
        await page.click('@issues-1');
        await page.expectToMatch('@bc-1', 'Home', true);
        await page.expectToMatch('@bc-2', 'Projects', true);
        await page.expectToMatch('@bc-3', 'p1 - Issues', true);
        await page.expectToBeHidden('@id-1');
        await page.reload();
        await page.expectToMatch('@bc-3', 'p1 - Issues', true);
      }
    );

    tester.test('create "bug1" issue', async () => {
      const page = await tester.getPage();
      await page.click('@add-issue-btn');
      await page.expectToMatch('@bc-3', 'p1 - Issues', true);
      await page.expectToMatch('@bc-4', 'Add Issue', true);
      await page.expectToBeHidden('@title @error');
      await page.expectToBeHidden('@description @error');
      await page.click('@post-btn');
      await page.expectToMatch('@title @error', 'Title is required', true);
      await page.expectToMatch(
        '@description @error',
        'Description is required',
        true
      );
      await page.reload();
      await page.type('@title input', 'bug1');
      await page.type('@description textarea', 'lorem ipsum');
      await page.click('@post-btn');
      await page.expectToMatch('@id-1', '1', true);
      await page.expectToMatch('@title-1', 'bug1', true);
      await page.expectToMatch('@author-1', 'owner1', true);
      await page.expectToMatch('@status-1', 'Open', true);
      await page.reload();
      await page.expectToMatch('@id-1', '1', true);
    });

    tester.test('open "bug1" details', async () => {
      const page = await tester.getPage();
      await page.click('@title-1');
      await page.expectToMatch('@bc-3', 'p1 - Issues', true);
      await page.expectToMatch('@bc-4', '#1', true);
      await page.expectToMatch('@issue-title', 'bug1 #1');
      await page.expectToMatch('@post-1 @author', 'owner1');
      await page.expectToMatch('@post-1 @desc', 'lorem ipsum');
      await page.reload();
      await page.expectToMatch('@issue-title', 'bug1 #1');
    });

    tester.test('create "bug2" issue', async () => {
      const page = await tester.getPage();
      await page.click('@bc-3');
      await page.click('@add-issue-btn');
      await page.type('@title input', 'bug2');
      await page.type('@description textarea', 'lorem ipsum2');
      await page.click('@post-btn');
      await page.expectToMatch('@id-1', '2', true);
      await page.expectToMatch('@title-1', 'bug2', true);
      await page.expectToMatch('@author-1', 'owner1', true);
      await page.expectToMatch('@status-1', 'Open', true);
      await page.expectToMatch('@id-2', '1', true);
      await page.expectToMatch('@title-2', 'bug1', true);
      await page.expectToMatch('@author-2', 'owner1', true);
      await page.expectToMatch('@status-2', 'Open', true);
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

    tester.test('verify reporter1 can see "p1" and "p2" projects', async () => {
      const page = await tester.getPage('reporter1');
      await page.click('@home-card-projects');
      await page.expectToMatch('@name-1', 'p1', true);
      await page.expectToMatch('@owner-1', 'owner1', true);
      await page.expectToMatch('@issues-1', '2 open issues', true);
      await page.expectToMatch('@name-2', 'p2', true);
      await page.expectToMatch('@owner-2', 'owner1', true);
      await page.expectToMatch('@issues-2', '0 open issues', true);
    });

    tester.test(
      'open "p2" project and verify there are no issues',
      async () => {
        const page = await tester.getPage('reporter1');
        await page.click('@issues-2');
        await page.expectToMatch('@bc-1', 'Home', true);
        await page.expectToMatch('@bc-2', 'Projects', true);
        await page.expectToMatch('@bc-3', 'p2 - Issues', true);
        await page.expectToBeHidden('@id-1');
      }
    );

    tester.test('add "bug 3" issue', async () => {
      const page = await tester.getPage('reporter1');
      await page.click('@add-issue-btn');
      await page.type('@title input', 'bug3');
      await page.type('@description textarea', 'lorem ipsum3');
      await page.click('@post-btn');
      await page.expectToMatch('@id-1', '1', true);
      await page.expectToMatch('@title-1', 'bug3', true);
      await page.expectToMatch('@author-1', 'reporter1', true);
      await page.expectToMatch('@status-1', 'Open', true);
      await page.expectToBeHidden('@id-2');
    });

    tester.test('open "bug3" details', async () => {
      const page = await tester.getPage('reporter1');
      await page.click('@title-1');
      await page.expectToMatch('@bc-3', 'p2 - Issues', true);
      await page.expectToMatch('@bc-4', '#1', true);
      await page.expectToMatch('@issue-title', 'bug3 #1');
      await page.expectToMatch('@post-1 @author', 'reporter1');
      await page.expectToMatch('@post-1 @desc', 'lorem ipsum3');
    });

    tester.test('verify projects page', async () => {
      const page = await tester.getPage('reporter1');
      await page.click('@bc-2');
      await page.expectToMatch('@issues-1', '2 open issues', true);
      await page.expectToMatch('@issues-2', '1 open issue', true);
    });
  },
} as TestConfiguration;
