import { StringSchema } from './StringSchema';
import { NumberSchema } from './NumberSchema';
import { BooleanSchema } from './BooleanSchema';
import { DateSchema } from './DateSchema';
import { EnumSchema } from './EnumSchema';
import { ArraySchema } from './ArraySchema';
import { ObjectSchema } from './ObjectSchema';
import { OrSchema } from './OrSchema';

export type Pick<T, K extends keyof T> = { [P in K]: T[P] };

export type NonNeverNames<T> = {
  [K in keyof T]: T[K] extends (null | undefined) ? never : K;
}[keyof T];

export type FilterNever<T> = Pick<T, NonNeverNames<T>>;

export type CheckNull<TNull, T> = TNull extends true ? (T | null) : T;

export type CheckREQ<TReq, TNull, T> = TReq extends true
  ? CheckNull<TNull, T>
  : CheckNull<TNull, T | undefined>;

export type PrimitiveSchema<TReg, TNull> =
  | StringSchema<TReg, TNull>
  | NumberSchema<TReg, TNull>
  | BooleanSchema<TReg, TNull>
  | DateSchema<TReg, TNull>
  | EnumSchema<TReg, TNull>;

export type ExtractPrimitive<T> = T extends StringSchema<
  infer TReq,
  infer TNull
>
  ? CheckREQ<TReq, TNull, string>
  : T extends NumberSchema<infer TReq, infer TNull>
  ? CheckREQ<TReq, TNull, number>
  : T extends BooleanSchema<infer TReq, infer TNull>
  ? CheckREQ<TReq, TNull, boolean>
  : T extends DateSchema<infer TReq, infer TNull>
  ? CheckREQ<TReq, TNull, Date>
  : T extends EnumSchema<infer TReq, infer TNull, infer TType>
  ? CheckREQ<TReq, TNull, TType>
  : T;

export type ExtractObject<T> = T extends object
  ? { [K in keyof T]: ConvertType<T[K]> }
  : T;

export type ConvertType<T> = T extends PrimitiveSchema<any, any>
  ? ExtractPrimitive<T>
  : T extends ArraySchema<infer TReq, infer TNull, infer K>
  ? CheckREQ<
      TReq,
      TNull,
      Array<
        K extends ObjectSchema<infer TReq, infer TNull, infer P>
          ? CheckREQ<TReq, TNull, P>
          : ConvertType<K>
      >
    >
  : T extends ObjectSchema<infer TReq, infer TNull, infer K>
  ? CheckREQ<TReq, TNull, K>
  : T extends OrSchema<infer TReq, infer TNull, infer K>
  ? CheckREQ<TReq, TNull, K>
  : T;

export type Convert<T> = ConvertType<T>;

export type NonFunctionProp<T> = T extends Function ? never : T;

export type OptionalPropNames<T> = {
  [P in keyof T]: undefined extends T[P] ? P : never;
}[keyof T];

export type RequiredPropNames<T> = {
  [P in keyof T]: undefined extends T[P] ? never : P;
}[keyof T];

export type OptionalProps<T> = { [P in OptionalPropNames<T>]: T[P] };
export type RequiredProps<T> = { [P in RequiredPropNames<T>]: T[P] };

export type MakeOptional<T> = { [P in keyof T]?: T[P] };

export type Flatten<T> = T extends object ? { [P in keyof T]: T[P] } : T;

export type ConvertObject<T> = T extends object
  ? Flatten<
      { [P in RequiredPropNames<T>]: T[P] } &
        { [P in OptionalPropNames<T>]?: T[P] }
    >
  : T;
