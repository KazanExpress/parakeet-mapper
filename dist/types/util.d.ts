export declare type Converter<I extends any = any, O extends any = any> = (input: I) => O;
export declare type EitherField<T extends object, TKey extends keyof T = keyof T> = TKey extends keyof T ? {
    [P in TKey]-?: T[TKey];
} & Partial<Record<Exclude<keyof T, TKey>, never>> : never;
export declare type InternalPropertyMapper<I extends object, O extends object, key extends keyof O> = {
    [IKey in keyof I]: Converter<I[IKey], O[key]>;
};
export declare type PropertyMapper<I extends object, O extends object, key extends keyof O, ikey extends keyof I> = EitherField<Partial<InternalPropertyMapper<I, O, key>>> | (ikey extends keyof I ? {
    [key: string]: Converter<I[ikey], O[key]>;
} : never);
export declare const isConverter: <I, O>(v: any) => v is Converter<I, O>;
export declare const isPropKey: (v: any) => v is never;
