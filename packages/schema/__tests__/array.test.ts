import { S, getValidateResult } from '../src/index';

describe('base', () => {
  it('should return an error if invalid array', () => {
    const schema = S.array();
    expect(getValidateResult(1, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be an array",
      "path": Array [],
      "type": "array.base",
      "value": 1,
    },
  ],
  "value": 1,
}
`);
  });
  it('should return no errors if valid array', () => {
    const schema = S.array();
    expect(getValidateResult([1], schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": Array [
    1,
  ],
}
`);
  });
});

describe('keys', () => {
  it('should return an error if key validation failed', () => {
    const schema = S.array().items({
      foo: S.string(),
    });
    expect(getValidateResult([{ foo: 1 }], schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be a string",
      "path": Array [
        0,
        "foo",
      ],
      "type": "string.base",
      "value": 1,
    },
  ],
  "value": Array [
    Object {
      "foo": 1,
    },
  ],
}
`);
  });

  it('should return a new copy of object if child has a new value', () => {
    const schema = S.array().items({
      foo: S.string().trim(),
    });
    const value = [{ foo: 'a ' }];
    const result = getValidateResult(value, schema);
    expect(result).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": Array [
    Object {
      "foo": "a",
    },
  ],
}
`);
    expect(result.value).not.toBe(value);
  });

  it('should return a new copy of object if child has a new value', () => {
    const schema = S.array().items({
      foo: S.string().trim(),
    });
    const value = [{ foo: 'a' }];
    const result = getValidateResult(value, schema);
    expect(result).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": Array [
    Object {
      "foo": "a",
    },
  ],
}
`);
    expect(result.value).toBe(value);
  });
});

describe('optional/null', () => {
  it('should return no errors if optional', () => {
    const schema = S.array().optional();
    expect(getValidateResult(undefined, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": undefined,
}
`);
  });

  it('should return no errors if nullable', () => {
    const schema = S.array().nullable();
    expect(getValidateResult(null, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": null,
}
`);
  });
});
