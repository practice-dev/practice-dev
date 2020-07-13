import { S, getValidateResult, validate } from '../src/index';

describe('complex example', () => {
  const schema = S.object().keys({
    username: S.string()
      .min(3)
      .max(30),
    password: S.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    birthyear: S.number()
      .integer()
      .min(1900)
      .max(2013),
    email: S.string().email(),
  });

  const getValid = () => ({
    username: 'john1',
    password: 'passWord',
    birthyear: 2000,
    email: 'john@example.com',
  });

  const getInvalid = () => ({
    username: 'john1',
    password: 'a',
    birthyear: 12,
    email: 'foo',
  });

  test('valid', () => {
    expect(validate(getValid(), schema, 'user')).toMatchInlineSnapshot(`
Object {
  "birthyear": 2000,
  "email": "john@example.com",
  "password": "passWord",
  "username": "john1",
}
`);
  });

  test('return validation errors', () => {
    expect(getValidateResult(getInvalid(), schema, ['user']))
      .toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must match regex /^[a-zA-Z0-9]{3,30}$/",
      "path": Array [
        "user",
        "password",
      ],
      "type": "string.regex",
      "value": "a",
    },
    Object {
      "message": "must be greater or equal to 1900",
      "path": Array [
        "user",
        "birthyear",
      ],
      "type": "number.base",
      "value": 12,
    },
    Object {
      "message": "must a valid email",
      "path": Array [
        "user",
        "email",
      ],
      "type": "string.email",
      "value": "foo",
    },
  ],
  "value": Object {
    "birthyear": 12,
    "email": "foo",
    "password": "a",
    "username": "john1",
  },
}
`);
  });

  test('throw error multiple props invalid', () => {
    expect(() =>
      validate(getInvalid(), schema, 'user')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Validation error: 'user.password' must match regex /^[a-zA-Z0-9]{3,30}$/. 'user.birthyear' must be greater or equal to 1900. 'user.email' must a valid email."`
    );
  });
});
