import { S, getValidateResult } from '../src/index';

describe('base', () => {
  it('should return an error if invalid string', () => {
    const schema = S.string();
    expect(getValidateResult(1, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must be a string",
      "path": Array [],
      "type": "string.base",
      "value": 1,
    },
  ],
  "value": 1,
}
`);
  });

  it('should return no errors if valid string', () => {
    const schema = S.string();
    expect(getValidateResult('1', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "1",
}
`);
  });
});

describe('optional/null', () => {
  it('should return no errors if optional', () => {
    const schema = S.string().optional();
    expect(getValidateResult(undefined, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": undefined,
}
`);
  });

  it('should return no errors if nullable', () => {
    const schema = S.string().nullable();
    expect(getValidateResult(null, schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": null,
}
`);
  });
});

describe('min', () => {
  it('should return an error if length lesser than min', () => {
    const schema = S.string().min(3);
    expect(getValidateResult('1', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "length must be at least 3 characters long",
      "path": Array [],
      "type": "string.min",
      "value": "1",
    },
  ],
  "value": "1",
}
`);
  });

  it('should not return an error if length equal to min ', () => {
    const schema = S.string().min(3);
    expect(getValidateResult('123', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "123",
}
`);
  });

  it('should not return an error if length greater than min ', () => {
    const schema = S.string().min(3);
    expect(getValidateResult('1234', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "1234",
}
`);
  });
});

describe('max', () => {
  it('should return an error if length greater than max', () => {
    const schema = S.string().max(3);
    expect(getValidateResult('1234', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "length must be less than or equal to 3 characters long",
      "path": Array [],
      "type": "string.max",
      "value": "1234",
    },
  ],
  "value": "1234",
}
`);
  });

  it('should not return an error if length equal to max ', () => {
    const schema = S.string().max(3);
    expect(getValidateResult('123', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "123",
}
`);
  });

  it('should not return an error if length lesser then max ', () => {
    const schema = S.string().max(3);
    expect(getValidateResult('12', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "12",
}
`);
  });
});

describe('trim', () => {
  it('should trim a string', () => {
    const schema = S.string().trim();
    expect(getValidateResult(' a ', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "a",
}
`);
  });
  it('should return an error if length is invalid after trim', () => {
    const schema = S.string()
      .trim()
      .min(2);
    expect(getValidateResult(' a ', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "length must be at least 2 characters long",
      "path": Array [],
      "type": "string.min",
      "value": "a",
    },
  ],
  "value": "a",
}
`);
  });
});

describe('regex', () => {
  it('should return no errors if valid', () => {
    const schema = S.string().regex(/^[a-z]+$/);
    expect(getValidateResult('abc', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "abc",
}
`);
  });

  it('should return an error if invalid', () => {
    const schema = S.string().regex(/^[a-z]+$/);
    expect(getValidateResult('abcZ', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must match regex /^[a-z]+$/",
      "path": Array [],
      "type": "string.regex",
      "value": "abcZ",
    },
  ],
  "value": "abcZ",
}
`);
  });
});

describe('email', () => {
  it('should return no errors if valid', () => {
    const schema = S.string().email();
    expect(getValidateResult('aa+a@example.com', schema))
      .toMatchInlineSnapshot(`
Object {
  "errors": Array [],
  "value": "aa+a@example.com",
}
`);
  });

  it('should return an error if invalid', () => {
    const schema = S.string().email();
    expect(getValidateResult('avc', schema)).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    Object {
      "message": "must a valid email",
      "path": Array [],
      "type": "string.email",
      "value": "avc",
    },
  ],
  "value": "avc",
}
`);
  });
});
