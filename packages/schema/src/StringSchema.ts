import { AnySchema } from './AnySchema';

const emailReg = /^[a-zA-Z0-9._\-+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export class StringSchema<TReq = true, TNull = false> extends AnySchema<
  TReq,
  TNull
> {
  readonly schema = 'string';

  constructor() {
    super();
    this.validators.push({
      type: 'string.base',
      validate: (value, path) => {
        if (typeof value !== 'string') {
          return {
            stop: true,
            error: {
              type: 'string.base',
              message: 'must be a string',
              path,
              value,
            },
          };
        }
        return null;
      },
    });
  }

  min(min: number) {
    this.validators.push({
      priority: 2,
      type: 'string.min',
      validate: (value: string, path) => {
        if (value.length < min) {
          return {
            stop: true,
            error: {
              type: 'string.min',
              message: `length must be at least ${min} characters long`,
              path,
              value,
            },
          };
        }
        return null;
      },
    });
    return this;
  }

  max(max: number) {
    this.validators.push({
      priority: 2,
      type: 'string.max',
      validate: (value: string, path) => {
        if (value.length > max) {
          return {
            stop: true,
            error: {
              type: 'string.max',
              message: `length must be less than or equal to ${max} characters long`,
              path,
              value,
            },
          };
        }
        return null;
      },
    });
    return this;
  }

  trim() {
    this.validators.push({
      priority: 1,
      type: 'string.trim',
      validate: (value: string) => {
        const trimmed = value.trim();
        if (trimmed !== value) {
          return {
            value: trimmed,
          };
        }
        return null;
      },
    });
    return this;
  }

  lowercase() {
    this.validators.push({
      priority: 1,
      type: 'string.lowercase',
      validate: (value: string) => {
        const lowercase = value.trim();
        if (lowercase !== value) {
          return {
            value: lowercase,
          };
        }
        return null;
      },
    });
    return this;
  }

  regex(reg: RegExp) {
    this.validators.push({
      type: 'string.regex',
      validate: (value: string, path) => {
        if (!reg.test(value)) {
          return {
            stop: true,
            error: {
              type: 'string.regex',
              message: `must match regex ${reg}`,
              path,
              value,
            },
          };
        }
        return null;
      },
    });
    return this;
  }

  email() {
    this.validators.push({
      type: 'string.email',
      validate: (value: string, path) => {
        if (!emailReg.test(value)) {
          return {
            stop: true,
            error: {
              type: 'string.email',
              message: `must a valid email`,
              path,
              value,
            },
          };
        }
        return null;
      },
    });
    return this;
  }

  optional() {
    this.validators.push({
      priority: -2,
      type: 'string.optional',
      validate: value => {
        if (value === undefined || value === '') {
          return {
            stop: true,
          };
        }
        return null;
      },
    });
    return (this as any) as StringSchema<false, TNull>;
  }

  nullEmpty() {
    this.validators.push({
      priority: -4,
      type: 'string.nullEmpty',
      validate: value => {
        if (value === '') {
          return {
            value: null,
          };
        }
        return null;
      },
    });
    return (this as any) as StringSchema<TReq, false>;
  }

  nullable() {
    return (super.nullable() as any) as StringSchema<TReq, true>;
  }
}
