import { AnySchema } from './AnySchema';
import { Convert } from './convert-types';
import { getValidateResult } from './validate';

export class OrSchema<
  TReq = true,
  TNull = false,
  TType = any
> extends AnySchema<TReq, TNull> {
  readonly schema = 'or';
  private allowedValues: AnySchema[] | null = null;

  constructor() {
    super();
    this.validators.push({
      priority: -100,
      type: 'or.validation',
      validate: () => {
        if (!this.allowedValues) {
          throw new Error('Or value not set');
        }
        return null;
      },
    });
    this.validators.push({
      type: 'or.base',
      validate: (value, path) => {
        for (const schema of this.allowedValues!) {
          if (!getValidateResult(value, schema).errors.length) {
            return null;
          }
        }

        return {
          stop: true,
          error: {
            type: 'or.base',
            message: 'must one of the required formats',
            path,
            value,
          },
        };
      },
    });
  }

  items<A extends AnySchema>(a: A): OrSchema<TReq, TNull, Convert<A>>;
  items<A extends AnySchema, B extends AnySchema>(
    a: A,
    b: B
  ): OrSchema<TReq, TNull, Convert<A | B>>;
  items<A extends AnySchema, B extends AnySchema, C extends AnySchema>(
    a: A,
    b: B,
    c: C
  ): OrSchema<TReq, TNull, Convert<A | B | C>>;
  items<
    A extends AnySchema,
    B extends AnySchema,
    C extends AnySchema,
    D extends AnySchema
  >(a: A, b: B, c: C, d: D): OrSchema<TReq, TNull, Convert<A | B | C | D>>;
  items<
    A extends AnySchema,
    B extends AnySchema,
    C extends AnySchema,
    D extends AnySchema,
    E extends AnySchema
  >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E
  ): OrSchema<TReq, TNull, Convert<A | B | C | D | E>>;
  items<T extends AnySchema>(...values: T[]) {
    this.allowedValues = values;
    return (this as any) as OrSchema<TReq, TNull, Convert<T[]>>;
  }

  optional() {
    return (super.optional() as any) as OrSchema<false, TNull, TType>;
  }

  nullable() {
    return (super.nullable() as any) as OrSchema<TReq, true, TType>;
  }
}
