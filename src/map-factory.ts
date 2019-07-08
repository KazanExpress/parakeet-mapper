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
>(fieldMap: TypeMap<I, O>): Converter<I, O>;

export function mapFactory<
  I extends object
>(): <
  F extends TypeMap<I, any>,
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
    const empty = {} as O;

    if (!fieldMap || !Object.keys(fieldMap).length) {
      return empty;
    }

    return typedKeyOf(fieldMap)
      .reduce((result, key) => {
        const value = fieldMap[key];

        if (isFlag(value) && value) {
          result[key] = input[key as string];
        }
        else if (isPropKey(value)) {
          result[key] = input[value];
        }
        else if (isConverter<I, O[keyof O]>(value)) {
          result[key] = value(input);
        }
        else if (isPropMapper<I, O>(value, key)) {
          const iKey = Object.keys(value)[0];
          result[key] = value[iKey](input[iKey]);
        }

        return result;
      }, empty);
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
   * if function - map by function from the original object
   */
  [key in keyof O]?: boolean | keyof I | Converter<I, O[key]> | PropertyMapper<I, O, key>;
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
                    : never;
}
