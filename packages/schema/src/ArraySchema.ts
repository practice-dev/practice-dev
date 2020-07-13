import { AnySchema } from './AnySchema';
import { SchemaLike, ErrorDetails } from './types';
import { getValidateResult } from './validate';
import { schemaLikeToSchema } from './utils';

export class ArraySchema<
  TReq = true,
  TNull = false,
  TItem = any
> extends AnySchema<TReq, TNull> {
  readonly schema = 'array';
  private _typeSchema: SchemaLike | null = null;

  constructor() {
    super();
    this.validators.push({
      type: 'array.base',
      validate: (value, path) => {
        if (!Array.isArray(value)) {
          return {
            stop: true,
            error: {
              type: 'array.base',
              message: 'must be an array',
              path,
              value,
            },
          };
        }
        return null;
      },
    });

    this.validators.push({
      type: 'array.items',
      validate: (value: any[], path) => {
        if (!this._typeSchema) {
          return null;
        }
        const errors: ErrorDetails[] = [];
        let isModified = false;
        const newValue = value.map((item, i) => {
          const result = getValidateResult(
            item,
            schemaLikeToSchema(this._typeSchema!),
            [...path, i]
          );
          errors.push(...result.errors);
          if (result.value !== item) {
            isModified = true;
          }
          return result.value;
        });
        if (errors.length) {
          return {
            stop: true,
            errors,
          };
        }
        if (isModified) {
          return { value: newValue };
        }
        return null;
      },
    });
  }

  items<T extends SchemaLike>(typeSchema: T) {
    this._typeSchema = typeSchema;
    return (this as any) as ArraySchema<TReq, TNull, T>;
  }

  optional() {
    return (super.optional() as any) as ArraySchema<false, TNull, TItem>;
  }

  nullable() {
    return (super.nullable() as any) as ArraySchema<TReq, true, TItem>;
  }

  min(min: number) {
    this.validators.push({
      type: 'array.min',
      validate: (value: any[], path) => {
        if (value.length < min) {
          return {
            stop: true,
            error: {
              type: 'array.port',
              message: `must have at least ${min} item`,
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
      type: 'array.max',
      validate: (value: any[], path) => {
        if (value.length > max) {
          return {
            stop: true,
            error: {
              type: 'array.port',
              message: `must have max ${max} items`,
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
}
