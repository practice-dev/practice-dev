import { AnySchema } from './AnySchema';

const isoDate = /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/;

export class DateSchema<TReq = true, TNull = false> extends AnySchema<
  TReq,
  TNull
> {
  readonly schema = 'date';

  constructor() {
    super();
    this.validators.push({
      type: 'date.base',
      validate: (value, path) => {
        if (typeof value === 'string') {
          if (isoDate.test(value)) {
            return {
              value: new Date(value),
            };
          }
        }
        const isDate = value instanceof Date;
        if (!isDate || value.toString() === 'Invalid Date') {
          return {
            stop: true,
            error: {
              type: 'data.base',
              message: 'must be a data',
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
    return (super.optional() as any) as DateSchema<false, TNull>;
  }

  nullable() {
    return (super.nullable() as any) as DateSchema<TReq, true>;
  }
}
