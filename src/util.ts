export type Converter<
  I extends any = any,
  O extends any = any
> = (input: I) => O;

export type EitherField<
  T extends object,
  TKey extends keyof T = keyof T
> = TKey extends keyof T ? {
  [P in TKey]-?: T[TKey]
} & Partial<Record<Exclude<keyof T, TKey>, never>> : never;

export type InternalPropertyMapper<
  I extends object,
  O extends object,
  key extends keyof O
> = { [IKey in keyof I]: Converter<I[IKey], O[key]> };

export type PropertyMapper<
  I extends object,
  O extends object,
  key extends keyof O
> = EitherField<Partial<InternalPropertyMapper<I, O, key>>>;

export const isFlag = (
  v: any
): v is boolean => typeof v === 'boolean';

export const isConverter = <I, O>(v: any): v is Converter<I, O> => typeof v === 'function';

export const isPropKey = (v: any): v is never => typeof v === 'string';

export const isPropMapper = <
  I extends object,
  O extends object,
  Keys extends keyof O = keyof O
>(v: any): v is InternalPropertyMapper<I, O, Keys> => typeof v === 'object' && isConverter(v[Object.keys(v)[0]]);

export const typedKeyOf = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;
