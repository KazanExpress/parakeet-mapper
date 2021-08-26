export declare type Converter<I extends any = any, O extends any = any> = (input: I) => O;
export declare type PropertyFactory<I extends any = any, O extends any = any, key extends keyof O = keyof O> = (input: I, output: O) => O[key];
export declare type EitherField<T, TKey extends keyof T = keyof T> = TKey extends keyof T ? {
    [P in TKey]-?: T[TKey];
} & Partial<Record<Exclude<keyof T, TKey>, never>> : never;
export declare type InternalPropertyMapper<I, O, key extends keyof O> = {
    [IKey in keyof I]: Converter<I[IKey], O[key]>;
};
export declare type PropertyMapper<I, O, key extends keyof O, ikey extends keyof I = Extract<key, keyof I>> = EitherField<Partial<InternalPropertyMapper<I, O, key>>> | (ikey extends keyof I ? {
    [key: string]: Converter<I[ikey], O[key]>;
} : never);
export declare type PropertyConverter<I, O, key extends keyof O, R extends O[key] = O[key]> = readonly [Converter<I[Extract<key, keyof I>], R>];
export declare const isFactory: <I, O, key extends keyof O>(v: any) => v is PropertyFactory<I, O, key>;
export declare const isPropKey: (v: any) => v is never;
