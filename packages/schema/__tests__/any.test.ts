import { S, getValidateResult } from '../src/index';

describe('base', () => {
  it('should return an error if undefined', () => {
    const schema = S.any();
    expect(getValidateResult(undefined, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "is required",
      "path": Array [],
      "type": "any.required",
      "value": undefined,
    },
  ],
  "value": undefined,
}
`);
  });

  it('should return an error if null', () => {
    const schema = S.any();
    expect(getValidateResult(null, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "is required",
      "path": Array [],
      "type": "any.required",
      "value": null,
    },
  ],
  "value": null,
}
`);
  });
});

describe('optional', () => {
  it('should not return an error if undefined', () => {
    const schema = S.any().optional();
    expect(getValidateResult(undefined, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": undefined,
}
`);
  });

  it('should not return an error if non-undefined', () => {
    const schema = S.any().optional();
    expect(getValidateResult(123, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 123,
}
`);
  });

  it('should return an error if null', () => {
    const schema = S.any().optional();
    expect(getValidateResult(null, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "is required",
      "path": Array [],
      "type": "any.required",
      "value": null,
    },
  ],
  "value": null,
}
`);
  });
});

describe('nullable', () => {
  it('should not return an error if null', () => {
    const schema = S.any().nullable();
    expect(getValidateResult(null, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": null,
}
`);
  });

  it('should not return an error if non-undefined', () => {
    const schema = S.any().nullable();
    expect(getValidateResult(123, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 123,
}
`);
  });

  it('should return an error if undefined', () => {
    const schema = S.any().nullable();
    expect(getValidateResult(undefined, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "is required",
      "path": Array [],
      "type": "any.required",
      "value": undefined,
    },
  ],
  "value": undefined,
}
`);
  });
});
