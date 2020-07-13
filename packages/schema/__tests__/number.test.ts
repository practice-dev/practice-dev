import { S, getValidateResult } from '../src/index';

describe('base', () => {
  it('should return an error if invalid number', () => {
    const schema = S.number();
    expect(getValidateResult('foo', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be a number",
      "path": Array [],
      "type": "number.base",
      "value": "foo",
    },
  ],
  "value": "foo",
}
`);
  });

  it('should return no errors if valid number', () => {
    const schema = S.number();
    expect(getValidateResult(1, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 1,
}
`);
  });
  //   it('should return no errors if valid number (str)', () => {
  //     const schema = S.number();
  //     expect(getValidateResult('1', schema)).toMatchInlineSnapshot(`
  // Object {
  //   "errors": Array [],
  //   "value": 1,
  // }
  // `);
  //   });
});

describe('optional/null', () => {
  it('should return no errors if optional number', () => {
    const schema = S.number().optional();
    expect(getValidateResult(undefined, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": undefined,
}
`);
  });

  it('should return no errors if nullable number', () => {
    const schema = S.number().nullable();
    expect(getValidateResult(null, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": null,
}
`);
  });
});

describe('integer', () => {
  it('should return an error if not integer', () => {
    const schema = S.number().integer();
    expect(getValidateResult(1.1, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be an integer",
      "path": Array [],
      "type": "number.integer",
      "value": 1.1,
    },
  ],
  "value": 1.1,
}
`);
  });

  it('should not return an error if valid integer', () => {
    const schema = S.number().integer();
    expect(getValidateResult(1, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 1,
}
`);
  });
});

describe('min', () => {
  it('should return an error if less than min', () => {
    const schema = S.number().min(3);
    expect(getValidateResult(2, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be greater or equal to 3",
      "path": Array [],
      "type": "number.base",
      "value": 2,
    },
  ],
  "value": 2,
}
`);
  });

  it('should not return an error if greater', () => {
    const schema = S.number().min(3);
    expect(getValidateResult(4, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 4,
}
`);
  });

  it('should not return an error if equal', () => {
    const schema = S.number().min(3);
    expect(getValidateResult(3, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 3,
}
`);
  });
});

describe('max', () => {
  it('should return an error if greater than max', () => {
    const schema = S.number().max(3);
    expect(getValidateResult(4, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be less or equal to 3",
      "path": Array [],
      "type": "number.base",
      "value": 4,
    },
  ],
  "value": 4,
}
`);
  });

  it('should not return an error if lesser', () => {
    const schema = S.number().max(3);
    expect(getValidateResult(2, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 2,
}
`);
  });

  it('should not return an error if equal', () => {
    const schema = S.number().max(3);
    expect(getValidateResult(3, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": 3,
}
`);
  });
});
