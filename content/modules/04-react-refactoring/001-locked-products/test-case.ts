import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('Navigate to page.', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    async function _expectDeleteModal(name: string) {
      await tester.getPage().expectToBeVisible(`@confirm-delete-modal`);
      await tester
        .getPage()
        .expectToMatch(`@confirm-delete-modal @modal-title`, 'Are you sure?');
      await tester
        .getPage()
        .expectToMatch(
          `@confirm-delete-modal @modal-description`,
          `Are you sure you want to delete the item "${name}"?`
        );
      await tester
        .getPage()
        .expectToMatch(`@confirm-delete-modal @modal-yes-btn`, `Yes`);
      await tester
        .getPage()
        .expectToBeEnabled(`@confirm-delete-modal @modal-yes-btn`);
      await tester
        .getPage()
        .expectToMatch(`@confirm-delete-modal @modal-no-btn`, `No`);
      await tester
        .getPage()
        .expectToBeEnabled(`@confirm-delete-modal @modal-no-btn`);
    }

    async function _expectLockedModal(name: string) {
      await tester.getPage().expectToBeVisible(`@confirm-locked-modal`);
      await tester
        .getPage()
        .expectToMatch(`@confirm-locked-modal @modal-title`, 'Item is locked!');
      await tester
        .getPage()
        .expectToMatch(
          `@confirm-locked-modal @modal-description`,
          `Are you sure you want to delete the locked item "${name}"?`
        );
      await tester
        .getPage()
        .expectToMatch(`@confirm-locked-modal @modal-yes-btn`, `Yes`);
      await tester
        .getPage()
        .expectToBeEnabled(`@confirm-locked-modal @modal-yes-btn`);
      await tester
        .getPage()
        .expectToMatch(`@confirm-locked-modal @modal-no-btn`, `No`);
      await tester
        .getPage()
        .expectToBeEnabled(`@confirm-locked-modal @modal-no-btn`);
    }

    async function _ensureLoading(fn: () => Promise<void>) {
      let start = Date.now();
      await fn();
      let end = Date.now();
      const delay = end - start;
      if (delay < 1000) {
        await tester.fail(
          `Loading should take at least 1000ms. Got ${delay}ms.`
        );
      }
    }

    async function _ensureNoLoading(fn: () => Promise<void>) {
      let start = Date.now();
      await fn();
      let end = Date.now();
      const delay = end - start;
      if (delay > 500) {
        await tester.fail(`Loading wasn't expected. Got ${delay}ms delay.`);
      }
    }

    tester.test('Verify default products are visible.', async () => {
      await tester.getPage().expectCount(`@item`, 4);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${1}) @name`, 'phone', true);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${2}) @name`, 'tablet (locked)', true);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${3}) @name`, 'pc (locked)', true);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${4}) @name`, 'laptop', true);
      await tester
        .getPage()
        .expectToBeVisible(`@item:nth-child(${1}) @delete-btn`);
      await tester
        .getPage()
        .expectToBeVisible(`@item:nth-child(${2}) @delete-btn`);
      await tester
        .getPage()
        .expectToBeVisible(`@item:nth-child(${3}) @delete-btn`);
      await tester
        .getPage()
        .expectToBeVisible(`@item:nth-child(${4}) @delete-btn`);
    });

    tester.test('Verify modals are hidden', async () => {
      await tester.getPage().expectToBeHidden(`@confirm-delete-modal`);
      await tester.getPage().expectToBeHidden(`@confirm-locked-modal`);
    });

    tester.test('Delete "phone" but click "No".', async () => {
      await tester.getPage().click(`@item:nth-child(${1}) @delete-btn`);
      await _expectDeleteModal('phone');
      await tester.getPage().click(`@confirm-delete-modal @modal-no-btn`);
      await tester.getPage().expectToBeHidden(`@confirm-delete-modal`);
      await tester.getPage().expectToBeHidden(`@confirm-locked-modal`);
      await tester.getPage().expectCount(`@item`, 4);
    });

    tester.test(
      'Delete "tablet" but click "No" in the locked modal.',
      async () => {
        await tester.getPage().click(`@item:nth-child(${2}) @delete-btn`);
        await _expectDeleteModal('tablet');
        await tester.getPage().click(`@confirm-delete-modal @modal-yes-btn`);
        await tester.getPage().expectToBeHidden(`@confirm-delete-modal`);
        await _expectLockedModal('tablet');
        await tester.getPage().click(`@confirm-locked-modal @modal-no-btn`);
        await tester.getPage().expectToBeHidden(`@confirm-locked-modal`);
        await tester.getPage().expectToBeHidden(`@confirm-delete-modal`);
        await tester.getPage().expectCount(`@item`, 4);
      }
    );

    tester.test('Delete "laptop".', async () => {
      await tester.getPage().click(`@item:nth-child(${4}) @delete-btn`);
      await _expectDeleteModal('laptop');
      await _ensureLoading(async () => {
        await tester.getPage().click(`@confirm-delete-modal @modal-yes-btn`);
        await tester.getPage().expectToBeHidden(`@confirm-locked-modal`);
        await Promise.all([
          tester
            .getPage()
            .expectToBeDisabled(`@confirm-delete-modal @modal-yes-btn`),
          tester
            .getPage()
            .expectToMatch(
              `@confirm-delete-modal @modal-yes-btn`,
              'Deleting...'
            ),
          tester
            .getPage()
            .expectToBeDisabled(`@confirm-delete-modal @modal-no-btn`),
        ]);
        await tester.getPage().expectToBeHidden(`@confirm-delete-modal`);
      });
      await tester.getPage().expectToBeHidden(`@confirm-locked-modal`);
      await tester.getPage().expectCount(`@item`, 3);
    });

    tester.test('Delete "phone".', async () => {
      await tester.getPage().click(`@item:nth-child(${1}) @delete-btn`);
      await _expectDeleteModal('phone');
      await _ensureLoading(async () => {
        await tester.getPage().click(`@confirm-delete-modal @modal-yes-btn`);
        await tester.getPage().expectToBeHidden(`@confirm-delete-modal`);
      });
      await tester.getPage().expectToBeHidden(`@confirm-locked-modal`);
      await tester.getPage().expectCount(`@item`, 2);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${1}) @name`, 'tablet (locked)', true);
    });

    tester.test('Delete "pc".', async () => {
      await tester.getPage().click(`@item:nth-child(${2}) @delete-btn`);
      await _expectDeleteModal('pc');
      await _ensureNoLoading(async () => {
        await tester.getPage().click(`@confirm-delete-modal @modal-yes-btn`);
        await tester.getPage().expectToBeHidden(`@confirm-delete-modal`);
        await tester.getPage().expectToBeVisible(`@confirm-locked-modal`);
      });
      await _expectLockedModal('pc');
      await _ensureLoading(async () => {
        await tester.getPage().click(`@confirm-locked-modal @modal-yes-btn`);
        await Promise.all([
          tester
            .getPage()
            .expectToBeDisabled(`@confirm-locked-modal @modal-yes-btn`),
          tester
            .getPage()
            .expectToMatch(
              `@confirm-locked-modal @modal-yes-btn`,
              'Deleting...'
            ),
          tester
            .getPage()
            .expectToBeDisabled(`@confirm-locked-modal @modal-no-btn`),
        ]);
        await tester.getPage().expectToBeHidden(`@confirm-locked-modal`);
      });
      await tester.getPage().expectCount(`@item`, 1);
      await tester
        .getPage()
        .expectToMatch(`@item:nth-child(${1}) @name`, 'tablet (locked)', true);
    });

    tester.test('Delete "tablet".', async () => {
      await tester.getPage().click(`@item:nth-child(${1}) @delete-btn`);
      await _expectDeleteModal('tablet');
      await _ensureNoLoading(async () => {
        await tester.getPage().click(`@confirm-delete-modal @modal-yes-btn`);
        await tester.getPage().expectToBeHidden(`@confirm-delete-modal`);
        await tester.getPage().expectToBeVisible(`@confirm-locked-modal`);
      });
      await _expectLockedModal('tablet');
      await _ensureLoading(async () => {
        await tester.getPage().click(`@confirm-locked-modal @modal-yes-btn`);
        await tester.getPage().expectToBeHidden(`@confirm-locked-modal`);
      });
      await tester.getPage().expectCount(`@item`, 0);
    });
  },
} as TestConfiguration;
