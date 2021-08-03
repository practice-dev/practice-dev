import { Validator } from './types';

export class AnySchema<TReq = true, TNull = false> {
  validators: Validator[] = [];

  constructor() {
    this.validators.push({
      priority: -1,
      type: 'any.required',
      validate: (value, path) => {
        if (value == null || value === '') {
          return {
            stop: true,
            error: {
              type: 'any.required',
              message: 'is required',
              path,
              value,
            },
          };
        }
        return null;
      },
    });
  }

  optional() {
    this.validators.push({
      priority: -2,
      type: 'any.optional',
      validate: value => {
        if (value === undefined) {
          return {
            stop: true,
          };
        }
        return null;
      },
    });
    return (this as any) as AnySchema<false, TNull>;
  }

  nullable() {
    this.validators.push({
      priority: -2,
      type: 'any.nullable',
      validate: value => {
        if (value === null) {
          return {
            stop: true,
          };
        }
        return null;
      },
    });
    return (this as any) as AnySchema<TReq, true>;
  }

  default(defaultValue: any) {
    this.validators.push({
      priority: -200,
      type: 'base.default',
      validate: (value: any) => {
        if (value == null) {
          return {
            stop: true,
            value: defaultValue,
          };
        }
        return null;
      },
    });
    return this;
  }
}
