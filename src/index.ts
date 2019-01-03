export function mapTypes<
  I extends object,
  O extends object,
>(input: I, FieldMap: TypeMap<I, O>): O {
  if (
    !FieldMap ||
    Array.isArray(FieldMap) ||
    !Object.keys(FieldMap).length
  ) {
    return {} as O;
  }

  const result: Partial<O> = {};
  for (const key in FieldMap) {
    if (typeof FieldMap[key] === 'boolean' && FieldMap[key]) {
      result[key] = input[key as string] as any;
      continue;
    }

    if (typeof FieldMap[key] === 'string') {
      result[key] = input[FieldMap[key as string]] as any;
      continue;
    }

    if (typeof FieldMap[key] === 'function') {
      let mapperValue = (FieldMap[key] as Function)(input)
      result[key] = mapperValue;
      continue;
    }
  }

  return result as O;
};

export type TypeMap<
  I extends object,
  O extends object
> = {
  /**
   * if has function - map by funciton
   * if true - map straight without changes
   * if false - do not map
   */
    [key in keyof Partial<O>]: boolean | keyof Partial<I> | ((obj: I) => O[key]);
};
