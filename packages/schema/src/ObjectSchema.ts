import { AnySchema } from './AnySchema';
import { SchemaMap, ErrorDetails } from './types';
import { getValidateResult } from './validate';
import { ExtractObject, ConvertObject } from './convert-types';

export class ObjectSchema<
  TReq = true,
  TNull = false,
  TKeys = {}
> extends AnySchema<TReq, TNull> {
  schema = 'object';
  private _keys: SchemaMap | null = null;
  private _allowUnknown: boolean = false;

  constructor() {
    super();
    this.validators.push({
      type: 'object.base',
      validate: (value, path) => {
        if (
          value === null ||
          Array.isArray(value) ||
          typeof value !== 'object'
        ) {
          return {
            stop: true,
            error: {
              type: 'object.base',
              message: 'must be an object',
              path,
              value,
            },
          };
        }
        return null;
      },
    });

    this.validators.push({
      type: 'object.keys',
      validate: (value: any, path) => {
        if (!this._keys) {
          return null;
        }
        const errors: ErrorDetails[] = [];
        let newValue: any;
        let isNewValueCloned = false;
        Object.keys({
          ...this._keys,
          ...value,
        }).forEach(key => {
          const propValue = value[key];
          const propSchema = this._keys![key];
          const propPath = [...path, key];
          if (!propSchema) {
            if (this._allowUnknown) {
              return;
            }
            errors.push({
              message: 'is not allowed',
              value: propValue,
              path: propPath,
              type: 'object.allowUnknown',
            });
            return;
          }
          const result = getValidateResult(
            propValue,
            propSchema as any,
            propPath
          );
          errors.push(...result.errors);
          if (result.value !== propValue) {
            if (!isNewValueCloned) {
              isNewValueCloned = true;
              newValue = { ...value };
            }
            newValue[key] = result.value;
          }
        });
        if (errors.length) {
          return {
            stop: true,
            errors,
          };
        }
        if (isNewValueCloned) {
          return {
            value: newValue,
          };
        }
        return null;
      },
    });
  }

  keys<K extends SchemaMap>(schema: K) {
    this._keys = schema;
    return (this as any) as ObjectSchema<
      TReq,
      TNull,
      ConvertObject<ExtractObject<typeof schema>>
    >;
    // ExtractObject<typeof schema>
  }

  unknown() {
    this._allowUnknown = true;
    return (this as any) as ObjectSchema<
      TReq,
      TNull,
      TKeys & { [key: string]: any }
    >;
  }

  as<T>() {
    return (this as any) as ObjectSchema<TReq, TNull, T>;
  }
  optional() {
    return (super.optional() as any) as ObjectSchema<false, TNull, TKeys>;
  }

  nullable() {
    return (super.nullable() as any) as ObjectSchema<TReq, true, TKeys>;
  }
}
