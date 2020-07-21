import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    const temps = [
      ['0', '32'],
      ['10', '50'],
      ['50', '122'],
      ['60', '140'],
      ['61', '141.8'],
      ['513', '955.4'],
      ['-90', '-130'],
    ];

    temps.forEach(([c, f]) => {
      tester.test(`enter ${c} °C`, async () => {
        await tester.getPage().type('@celsius input', c);
        await tester.getPage().expectToMatch('@fahrenheit input', f, true);
        await tester.getPage().clear('@celsius input');
        await tester.getPage().expectToMatch('@fahrenheit input', '', true);
      });
    });

    temps.forEach(([c, f]) => {
      tester.test(`enter ${f} °F`, async () => {
        await tester.getPage().type('@fahrenheit input', f);
        await tester.getPage().expectToMatch('@celsius input', c, true);
        await tester.getPage().clear('@fahrenheit input');
        await tester.getPage().expectToMatch('@celsius input', '', true);
      });
    });
  },
} as TestConfiguration;
