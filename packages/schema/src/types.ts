import { AnySchema } from './AnySchema';
import { StringSchema } from './StringSchema';
import { ObjectSchema } from './ObjectSchema';
import { ArraySchema } from './ArraySchema';
import { BooleanSchema } from './BooleanSchema';
import { NumberSchema } from './NumberSchema';
import { DateSchema } from './DateSchema';

export type Path = Array<string | number>;

export interface ErrorDetails {
  message: string;
  path: Path;
  type: string;
  value: any;
}

type Validate = (
  value: any,
  path: Path
) => {
  error?: ErrorDetails;
  errors?: ErrorDetails[];
  stop?: boolean;
  value?: any;
} | null;

export interface Validator {
  priority?: number;
  type: string;
  validate: Validate;
}

export type Schema =
  | AnySchema
  | ArraySchema
  // | BinarySchema
  | BooleanSchema
  | DateSchema
  // | FunctionSchema
  | NumberSchema
  | ObjectSchema
  | StringSchema;

export type SchemaLike =
  // | string
  // | number
  // | boolean
  // | object
  // | null
  Schema | SchemaMap;

export interface SchemaMap {
  [key: string]: SchemaLike | SchemaLike[];
}
