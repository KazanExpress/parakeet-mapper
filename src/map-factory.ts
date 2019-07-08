import {
  isFlag,
  isPropKey,
  isConverter,
  isPropMapper,
  typedKeyOf,
  Converter,
  PropertyMapper
} from './util';

export function mapFactory<
  I extends object,
  O extends object,
>(fieldMap: TypeMap<I, O>): (
  | Converter<I, O>
  & Converter<I[], O[]>
  & Converter<I | I[], O | O[]>
);

export function mapFactory<
  I extends object
>(): <
  F extends TypeMap<I, any>,
  O extends object = InferOutput<I, F>
>(fieldMap: F) => (
  | Converter<I, O>
  & Converter<I[], O[]>
  & Converter<I | I[], O | O[]>
);

export function mapFactory<
  I extends object,
  O extends object
>(): <
  F extends TypeMap<I, O>,
  Output extends object = InferOutput<I, F>
>(fieldMap: F) => (
  | Converter<I, Output>
  & Converter<I[], Output[]>
  & Converter<I | I[], Output | Output[]>
);

export function mapFactory<
  I extends object,
  O extends object,
>(fieldMap?: TypeMap<I, O>) {
  if (!fieldMap) {
    return mapFactory;
  }

  const empty = {} as O;

  function map(input: I): O;
  function map(input: I[]): O[];
  function map(input: I | I[]): O | O[] {
    if (Array.isArray(input)) {
      return input.map(_ => map(_));
    }

    if (!fieldMap || !Object.keys(fieldMap).length) {
      return empty;
    }

    const keys = typedKeyOf(fieldMap);

    return keys.reduce((result, key) => {
      const value = fieldMap[key];

      if (isFlag(value) && value) {
        result[key] = input[key as string] as any;
      } else if (isPropKey(value)) {
        result[key] = input[fieldMap[key as string]] as any;
      } else if (isConverter<I, O[keyof O]>(value)) {
        result[key] = value(input);
      } else if (isPropMapper<I, O, keyof O>(value, key)) {
        const iKey = Object.keys(value)[0];

        result[key] = value[iKey](input[iKey]);
      }

      return result;
    }, empty);
  };

  return map;
}

export type InferConverter<
  I extends object,
  T extends TypeMap<I, O>,
  O extends object = InferOutput<I, T>
> = Converter<I, O>;

export type TypeMap<
  I extends object = any,
  O extends object = any
> = {
  /**
   * if true - map straight without changes
   * if false - do not map
   * if string - map from the according key
   * if object - map from key in the object using mapper from the value
   * if function - map by function from the original object
   */
  [key in keyof O]?: boolean | keyof I | Converter<I, O[key]> | PropertyMapper<I, O, key>;
};

export type InferOutput<I extends object, T extends TypeMap<I, any>> = {
  [key in keyof T]-?: T[key] extends true
                      ? I[Extract<key, keyof I>]
                    : T[key] extends keyof I
                      ? I[T[key]]
                    : T[key] extends Converter<I, infer OT>
                      ? OT
                    : T[key] extends Partial<Record<string, infer OT>>
                      ? OT extends Converter<any, infer OKT>
                        ? OKT
                      : never
                    : never;
}
