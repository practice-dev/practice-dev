import { S, getValidateResult } from '../src/index';

enum TestEnum {
  ValueA = 'ValueA',
  ValueB = 'ValueB',
}

it('should throw an error if values not provided', () => {
  const schema = S.enum();
  expect(() =>
    getValidateResult(null, schema)
  ).toThrowErrorMatchingInlineSnapshot(`"Enum value not set"`);
});

describe('base (values)', () => {
  it('should return an error if invalid enum', () => {
    const schema = S.enum().values<TestEnum>(Object.values(TestEnum));
    expect(getValidateResult(1, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be an enum: ValueA, ValueB",
      "path": Array [],
      "type": "enum.base",
      "value": 1,
    },
  ],
  "value": 1,
}
`);
  });

  it('should return no error if valid enum', () => {
    const schema = S.enum().values<TestEnum>(Object.values(TestEnum));
    expect(getValidateResult(TestEnum.ValueA, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "ValueA",
}
`);
  });

  it('should return no error if valid enum (case insensitive)', () => {
    const schema = S.enum().values<TestEnum>(Object.values(TestEnum));
    expect(getValidateResult('valuea', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "ValueA",
}
`);
  });
});

describe('base (literal)', () => {
  it('should return an error if invalid enum (literal)', () => {
    const schema = S.enum().literal('valA', 'valB');
    expect(getValidateResult(1, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be an enum: valA, valB",
      "path": Array [],
      "type": "enum.base",
      "value": 1,
    },
  ],
  "value": 1,
}
`);
  });

  it('should return no error if valid enum (literal)', () => {
    const schema = S.enum().literal('valA', 'valB');
    expect(getValidateResult('valA', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "valA",
}
`);
  });

  it('should return no error if valid enum (literal) (case insensitive)', () => {
    const schema = S.enum().literal('valA', 'valB');
    expect(getValidateResult('vala', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "valA",
}
`);
  });
});

describe('optional/null', () => {
  it('should return no errors if optional', () => {
    const schema = S.enum()
      .literal('valA', 'valB')
      .optional();
    expect(getValidateResult(undefined, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": undefined,
}
`);
  });

  it('should return no errors if nullable', () => {
    const schema = S.enum()
      .literal('valA', 'valB')
      .nullable();
    expect(getValidateResult(null, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": null,
}
`);
  });
});
