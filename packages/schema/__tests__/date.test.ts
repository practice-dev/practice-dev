import { S, getValidateResult } from '../src/index';

describe('base', () => {
  it('should return an error if invalid date', () => {
    const schema = S.date();
    expect(getValidateResult(1, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be a data",
      "path": Array [],
      "type": "data.base",
      "value": 1,
    },
  ],
  "value": 1,
}
`);
  });

  it('should return an error if invalid date (invalid iso)', () => {
    const schema = S.date();
    expect(getValidateResult('1344-21-23', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be a data",
      "path": Array [],
      "type": "data.base",
      "value": "1344-21-23",
    },
  ],
  "value": "1344-21-23",
}
`);
  });

  it('should return an error if invalid date (invalid Date)', () => {
    const schema = S.date();
    expect(getValidateResult(new Date('a'), schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be a data",
      "path": Array [],
      "type": "data.base",
      "value": Date { NaN },
    },
  ],
  "value": Date { NaN },
}
`);
  });

  it('should return no errors if valid date', () => {
    const schema = S.date();
    expect(getValidateResult(new Date(1), schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 1970-01-01T00:00:00.001Z,
}
`);
  });

  it('should return no errors if valid date (iso)', () => {
    const schema = S.date();
    expect(getValidateResult(new Date(1).toISOString(), schema))
      .toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 1970-01-01T00:00:00.001Z,
}
`);
  });
});

describe('optional/null', () => {
  it('should return no errors if optional', () => {
    const schema = S.date().optional();
    expect(getValidateResult(undefined, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": undefined,
}
`);
  });

  it('should return no errors if nullable', () => {
    const schema = S.date().nullable();
    expect(getValidateResult(null, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": null,
}
`);
  });
});
