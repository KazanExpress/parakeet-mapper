type ConverterMap<O> = {
  [key in keyof Partial<O>]: (i: O[key]) => any;
};

type ConvertedMap<
  O extends object,
  CM extends ConverterMap<O>
> = {
  [key in keyof O]: key extends keyof CM ? ReturnType<CM[key]> : O[key]
};

export function mapFactory<
  I extends object,
  O extends object
>(FieldMap: TypeMap<I, O>): {
  (input: I): O;

  /**
   * @param converters - a map of resulting value converters
   */
  <CM extends ConverterMap<O>>(
    input: I,
    converters: CM
  ): ConvertedMap<O, CM>;
};

export function mapFactory<
  I extends object,
  O extends object,
>(FieldMap: TypeMap<I, O>) {
  return function <CM extends ConverterMap<O>>(
    input: I,
    converters?: CM
  ): O | ConvertedMap<O, CM> {
    if (
      !FieldMap ||
      Array.isArray(FieldMap) ||
      !Object.keys(FieldMap).length
    ) {
      return {} as O;
    }

    const convert = converters ? (key: string, value: any) => (
      typeof converters[key] === 'function' ? converters[key](value) : value
    ) : (_key: string, value: any) => value;

    const result: Partial<O> = {};
    for (const key in FieldMap) {
      if (typeof FieldMap[key] === 'boolean' && FieldMap[key]) {
        result[key] = convert(key, input[key as string] as any);
        continue;
      }

      if (typeof FieldMap[key] === 'string') {
        result[key] = convert(key, input[FieldMap[key as string]] as any);
        continue;
      }

      if (typeof FieldMap[key] === 'function') {
        let mapperValue = (FieldMap[key] as Function)(input);
        result[key] = convert(key, mapperValue);
        continue;
      }
    }

    return result as O;
  };
}

export function mapTypes<
  I extends object,
  O extends object
>(input: I, FieldMap: TypeMap<I, O>): O {
  return mapFactory(FieldMap)(input);
}

export type TypeMap<
  I extends object = any,
  O extends object = any
> = {
  /**
   * if has function - map by funciton
   * if true - map straight without changes
   * if false - do not map
   */
    [key in keyof Partial<O>]: boolean | keyof Partial<I> | ((obj: I) => O[key]);
};
