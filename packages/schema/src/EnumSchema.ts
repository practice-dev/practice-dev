import { AnySchema } from './AnySchema';

export class EnumSchema<
  TReq = true,
  TNull = false,
  TType = any
> extends AnySchema<TReq, TNull> {
  readonly schema = 'enum';
  private allowedValues: any[] | null = null;

  constructor() {
    super();
    this.validators.push({
      priority: -100,
      type: 'enum.validation',
      validate: () => {
        if (!this.allowedValues) {
          throw new Error('Enum value not set');
        }
        return null;
      },
    });
    this.validators.push({
      type: 'enum.base',
      validate: (value, path) => {
        for (const allowed of this.allowedValues!) {
          if (String(allowed).toLowerCase() === String(value).toLowerCase()) {
            return {
              value: allowed,
            };
          }
        }

        return {
          stop: true,
          error: {
            type: 'enum.base',
            message: 'must be an enum: ' + this.allowedValues!.join(', '),
            path,
            value,
          },
        };
      },
    });
  }

  optional() {
    return (super.optional() as any) as EnumSchema<false, TNull, TType>;
  }

  nullable() {
    return (super.nullable() as any) as EnumSchema<TReq, true, TType>;
  }

  values<T>(values: any[]) {
    this.allowedValues = values;
    return (this as any) as EnumSchema<TReq, TNull, T>;
  }

  literal<T extends string>(...values: T[]) {
    this.allowedValues = values;
    return (this as any) as EnumSchema<TReq, TNull, T>;
  }
}
