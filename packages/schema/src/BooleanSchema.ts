import { AnySchema } from './AnySchema';

export class BooleanSchema<TReq = true, TNull = false> extends AnySchema<
  TReq,
  TNull
> {
  readonly schema = 'boolean';

  constructor() {
    super();
    this.validators.push({
      type: 'boolean.base',
      validate: (value, path) => {
        // if (typeof value === 'string') {
        //   if (value === 'true' || value === 'false') {
        //     return {
        //       value: value === 'true',
        //     };
        //   }
        // }
        if (typeof value !== 'boolean') {
          return {
            stop: true,
            error: {
              type: 'boolean.base',
              message: 'must be a boolean',
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
    return (super.optional() as any) as BooleanSchema<false, TNull>;
  }

  nullable() {
    return (super.nullable() as any) as BooleanSchema<TReq, true>;
  }
}
