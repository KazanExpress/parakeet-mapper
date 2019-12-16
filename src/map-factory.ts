import {
  isPropKey,
  isFactory,
  Converter,
  PropertyMapper,
  PropertyConverter,
  PropertyFactory
} from './util';

export function mapFactory<
  I extends object,
  O extends object,
>(fieldMap: TypeMap<I, O>): Converter<I, O>;

export function mapFactory<
  I extends object
>(): <
  F extends TypeMap<I>,
  O extends object = InferOutput<I, F>
>(fieldMap: F) => Converter<I, O>;

export function mapFactory<
  I extends object,
  O extends object
>(): <
  F extends TypeMap<I, O>,
  RealO extends object = InferOutput<I, F, O>
>(fieldMap: F) => Converter<I, RealO>;

export function mapFactory<
  I extends object,
  O extends object,
>(fieldMap?: TypeMap<I, O>) {
  if (!fieldMap) {
    return mapFactory;
  }

  return function (input: I): O {
    const result = {} as O;

    for (const key in fieldMap) {
      const value = fieldMap[key];
      const inputValue = input[key as string];

      if (value === true) {
        result[key] = inputValue;
      } else if (isPropKey(value)) {
        result[key] = input[value];
      } else if (isFactory<I, O, Extract<keyof O, string>>(value)) {
        result[key] = value(input, result);
      } else if (typeof value === 'object') {
        for (const iKey in (value as object)) {
          const iValue = input[iKey];

          // If no value is found in input - get it by the same key as in the output
          result[key] = value[iKey](
            iValue == null ? inputValue : iValue
          );

          // We only need to check the first key
          break;
        }
      }
    }

    return result;
  };
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
   * if array - map from the key in map using the first value in the array
   * if function - map by function from the original object
   */
  [key in keyof O]:
    | boolean
    | keyof I
    | PropertyFactory<I, O, key>
    | PropertyMapper<I, O, key>
    | PropertyConverter<I, O, key>
};

export type InferOutput<I extends object, T extends TypeMap<I, O>, O extends object = any> = {
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
                    : T[key] extends readonly [Converter<any, infer R>]
                      ? R
                    : never;
};
