import { TestConfiguration } from '@pvd/tester';
import { inputData } from './details/assets/input-data';

const results: string[] = [
  // rule 10
  'Merill, Meyer, Abbott and 1 another person like it',
  // rule 11
  'Ross, Jerrie, Eamon and 3 other people like it',
  // rule 9
  'Eamon, Ross and Jerrie like it',
  // rule 7
  'You, Meyer and 3 other people like it',
  // rule 7
  'You, Merill, Meyer, Otes and 3 other people like it',
  // rule 4
  'You and 3 other people like it',
  // rule 10
  'Eamon and 1 another person like it',
  // rule 12
  '1 person likes it',
  // rule 6
  'You, Eamon and 1 another person like it',
  // rule 13
  '3 people like it',
  // rule 6
  'You, Meyer, Otes, Vera and 1 another person like it',
  // rule 1
  '0 Likes',
  // rule 5
  'You and Abbott like it',
  // rule 5
  'You, Nevsa, Tod and Abbott like it',
  // rule 8
  'Meyer likes it',
  // rule 11
  'Vera and 3 other people like it',
  // rule 3
  'You and 1 another person like it',
  // rule 2
  'You like it',
];

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    inputData.forEach((input, i) => {
      tester.test(`verify input data id = ${input.id}`, async () => {
        await tester.getPage().type('@input-id input', input.id.toString());
        await tester
          .getPage()
          .expectToMatch('@input-id input', input.id.toString(), true);
        await tester.getPage().click('@format-btn');
        await tester.getPage().expectToMatch('@result', results[i], true);
        await tester.getPage().clear('@input-id input');
        await tester.getPage().expectToMatch('@input-id input', '', true);
      });
    });
  },
} as TestConfiguration;
