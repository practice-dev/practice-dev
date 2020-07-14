import { TestConfiguration } from '@pvd/tester';
import { S } from '@pvd/schema';

export default {
  handler({ tester, url }) {
    tester.setBaseApiUrl(url);

    const validPasswords = [
      'foobar!',
      'foobar@',
      'foobar#',
      'foobar$',
      '@@@@@',
      'a b $ d e',
      'a!b@c#d)',
    ];

    const invalidPassword = [
      '',
      '  ',
      'fo!',
      'foobar',
      'foobar&',
      'foobar! ',
      ' foobar!',
    ];

    const check = async (password: string, isValid: boolean) => {
      const [body, res] = await tester.makeRequest({
        method: 'POST',
        path: '/validate',
        body: {
          password,
        },
      });

      await tester.expectStatus(res, 200);
      const data = await tester.expectSchema(
        body,
        S.object().keys({
          isValid: S.boolean(),
        }),
        'body',
        'ValidationResult'
      );
      await tester.expectEqual(data.isValid, isValid, 'body.isValid');
    };

    validPasswords.forEach((password) => {
      tester.test(`Password '${password}' should be valid`, async () => {
        await check(password, true);
      });
    });

    invalidPassword.forEach((password) => {
      tester.test(`Password '${password}' should be invalid`, async () => {
        await check(password, false);
      });
    });

    tester.test('Random tests', async () => {
      for (let i = 0; i < 15; i++) {
        const r = await tester.randomInt();
        let isValid = true;
        let password = r + 'abcdef#';
        if (r % 3 === 0) {
          password += ' ';
          isValid = false;
        }
        if (r % 4 === 0) {
          password = password.substr(0, 3);
          isValid = false;
        }
        await check(password, isValid);
      }
    });
  },
} as TestConfiguration;
