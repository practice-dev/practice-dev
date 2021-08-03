import { AnySchema } from './AnySchema';

export class NumberSchema<TReq = true, TNull = false> extends AnySchema<
  TReq,
  TNull
> {
  readonly schema = 'number';

  constructor() {
    super();
    this.validators.push({
      type: 'number.base',
      validate: (value, path) => {
        // if (typeof value === 'string') {
        //   const parsed = Number(value);
        //   if (!isNaN(parsed)) {
        //     return {
        //       value: parsed,
        //     };
        //   }
        // }
        if (typeof value !== 'number') {
          return {
            stop: true,
            error: {
              type: 'number.base',
              message: 'must be a number',
              path,
              value,
            },
          };
        }
        return null;
      },
    });
  }

  integer() {
    this.validators.push({
      type: 'number.integer',
      validate: (value, path) => {
        if (!Number.isInteger(value)) {
          return {
            stop: true,
            error: {
              type: 'number.integer',
              message: 'must be an integer',
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

  min(min: number) {
    this.validators.push({
      priority: 2,
      type: 'number.min',
      validate: (value: number, path) => {
        if (value < min) {
          return {
            stop: true,
            error: {
              type: 'number.base',
              message: `must be greater or equal to ${min}`,
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
      type: 'number.max',
      validate: (value: number, path) => {
        if (value > max) {
          return {
            stop: true,
            error: {
              type: 'number.base',
              message: `must be less or equal to ${max}`,
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
    return (super.optional() as any) as NumberSchema<false, TNull>;
  }

  nullable() {
    return (super.nullable() as any) as NumberSchema<TReq, true>;
  }
}
