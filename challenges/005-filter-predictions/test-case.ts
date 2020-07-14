import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    const assert = (group: string, item: string, text: string) => {
      return tester
        .getPage()
        .expectToMatch(`@${group}-group @item-${item}`, text, true);
    };
    const assertOrder = (group: string, item: string, order: number) => {
      return tester
        .getPage()
        .expectOrder(`@${group}-group @^item-`, `@item-${item}`, order);
    };
    const click = (group: string, item: string) => {
      return tester.getPage().click(`@${group}-group @item-${item}`);
    };
    const disabled = (group: string, item: string) => {
      return tester
        .getPage()
        .expectToBeDisabled(`@${group}-group @item-${item} input`);
    };
    const enabled = (group: string, item: string) => {
      return tester
        .getPage()
        .expectToBeEnabled(`@${group}-group @item-${item} input`);
    };
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });
    tester.test('verify all groups are displayed', async () => {
      await tester.getPage().expectToBeVisible('@vendor-group');
      await tester.getPage().expectToBeVisible('@capacity-group');
      await tester.getPage().expectToBeVisible('@speed-group');
      await tester.getPage().expectToBeVisible('@cycle-latency-group');
      await tester.getPage().expectToBeVisible('@color-group');
    });
    tester.test('verify default values', async () => {
      await assert('vendor', 'BESTRAM', 'BESTRAM (64)');
      await assert('vendor', 'Rocket', 'Rocket (42)');
      await assert('vendor', 'gTech', 'gTech (28)');
      await assert('vendor', '5Byte', '5Byte (24)');
      await assert('vendor', 'Xdata', 'Xdata (23)');
      await assert('vendor', 'Abc', 'Abc (19)');
      await assert('capacity', '4', '4 GB (81)');
      await assert('capacity', '8', '8 GB (67)');
      await assert('capacity', '32', '32 GB (29)');
      await assert('capacity', '16', '16 GB (23)');
      await assert('speed', '2400', '2400 MHz (80)');
      await assert('speed', '2666', '2666 MHz (30)');
      await assert('speed', '3333', '3333 MHz (25)');
      await assert('speed', '3200', '3200 MHz (23)');
      await assert('speed', '3600', '3600 MHz (21)');
      await assert('speed', '4000', '4000 MHz (21)');
      await assert('cycle-latency', 'CL-7', 'CL 7 (54)');
      await assert('cycle-latency', 'CL-9', 'CL 9 (51)');
      await assert('cycle-latency', 'CL-12', 'CL 12 (51)');
      await assert('cycle-latency', 'CL-11', 'CL 11 (44)');
      await assert('color', 'Green', 'Green (94)');
      await assert('color', 'Black', 'Black (50)');
      await assert('color', 'Red', 'Red (31)');
      await assert('color', 'White', 'White (25)');
    });
    tester.test('verify default order', async () => {
      await assertOrder('vendor', 'BESTRAM', 1);
      await assertOrder('vendor', 'Rocket', 2);
      await assertOrder('vendor', 'gTech', 3);
      await assertOrder('vendor', '5Byte', 4);
      await assertOrder('vendor', 'Xdata', 5);
      await assertOrder('capacity', '4', 1);
      await assertOrder('capacity', '8', 2);
      await assertOrder('capacity', '32', 3);
      await assertOrder('capacity', '16', 4);
      await assertOrder('speed', '2400', 1);
      await assertOrder('speed', '2666', 2);
      await assertOrder('speed', '3333', 3);
      await assertOrder('speed', '3200', 4);
      await assertOrder('speed', '3600', 5);
      await assertOrder('speed', '4000', 6);
      await assertOrder('cycle-latency', 'CL-7', 1);
      await assertOrder('cycle-latency', 'CL-9', 2);
      await assertOrder('cycle-latency', 'CL-12', 3);
      await assertOrder('cycle-latency', 'CL-11', 4);
      await assertOrder('color', 'Green', 1);
      await assertOrder('color', 'Black', 2);
      await assertOrder('color', 'Red', 3);
      await assertOrder('color', 'White', 4);
    });

    tester.test('fuzzy test 1', async () => {
      await click('vendor', 'BESTRAM');
      await assert('vendor', 'Rocket', 'Rocket (42)');
      await assert('capacity', '8', '8 GB (24)');
      await assert('speed', '3200', '3200 MHz (4)');
      await assert('cycle-latency', 'CL-9', 'CL 9 (18)');
      await assert('color', 'White', 'White (11)');
      await click('vendor', 'Abc');
      await assert('vendor', 'Rocket', 'Rocket (42)');
      await assert('capacity', '8', '8 GB (28)');
      await assert('speed', '3333', '3333 MHz (5)');
      await assert('color', 'Red', 'Red (12)');
      await click('speed', '3333');
      await assert('vendor', 'Xdata', 'Xdata (5)');
      await assert('cycle-latency', 'CL-11', 'CL 11 (1)');
      await disabled('color', 'Red');
      await click('color', 'Green');
      await click('vendor', 'Abc');
      await click('vendor', 'BESTRAM');
      await assert('vendor', 'BESTRAM', 'BESTRAM (1)');
      await assert('capacity', '4', '4 GB (4)');
      await enabled('color', 'Red');
    });
    tester.test('fuzzy test 2', async () => {
      await tester.getPage().reload();
      await click('speed', '3333');
      await click('speed', '2400');
      await click('cycle-latency', 'CL-12');
      await click('cycle-latency', 'CL-11');
      await click('color', 'Red');
      await click('color', 'White');
      await click('capacity', '32');
      await click('capacity', '8');
      await click('capacity', '4');
      await click('cycle-latency', 'CL-12');
      await click('cycle-latency', 'CL-11');
      await assert('color', 'Green', 'Green (41)');
      await assert('color', 'Black', 'Black (25)');
      await assert('speed', '3200', '3200 MHz (6)');
      await assert('speed', '4000', '4000 MHz (5)');
      await assert('vendor', 'BESTRAM', 'BESTRAM (9)');
      await assert('vendor', '5Byte', '5Byte (5)');
    });
  },
} as TestConfiguration;
