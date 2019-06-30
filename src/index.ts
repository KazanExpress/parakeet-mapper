export declare function mapFactory<
  I extends object,
  O extends object,
  F extends TypeMap<I, O> | TypeMapFactory<I, O> = TypeMap<I, O>,
  P extends any[] = F extends TypeMapFactory<I, O, infer U> ? U : never[]
>(fieldMap: F): Converter<I, O, P>;

export type Converter<
  Input extends any = any,
  Output extends any = any,
  Params extends any[] = never[]
> = Params extends never[] ? (input: Input) => Output
  : (input: Input, ...params: Params) => Output;

export type EitherField<
  T extends object,
  TKey extends keyof T = keyof T
> = TKey extends keyof T ? {
  [P in TKey]-?: T[TKey]
} & Partial<Record<Exclude<keyof T, TKey>, never>> : never;

export type PropertyMapper<
  I extends object,
  O extends object,
  key extends keyof O
> = EitherField<{ [IKey in keyof I]?: Converter<I[IKey], O[key]> }>;

export type TypeMap<
  I extends object = any,
  O extends object = any
> = {
  /**
   * if true - map straight without changes
   * if false - do not map
   * if string - map from the according key
   * if object - map from key in the object using mapper from the value
   * if function - map by funciton from the original object
   */
  [key in keyof O]?: boolean | keyof I | Converter<I, O[key]> | PropertyMapper<I, O, key>;
};

export type TypeMapFactory<
  I extends object = any,
  O extends object = any,
  P extends any[] = never[]
> = (...params: P) => TypeMap<I, O>;
