import { Converter, PropertyMapper, PropertyConverter } from './util';
export declare function mapFactory<I extends object, O extends object>(fieldMap: TypeMap<I, O>): Converter<I, O>;
export declare function mapFactory<I extends object>(): <F extends TypeMap<I>, O extends object = InferOutput<I, F>>(fieldMap: F) => Converter<I, O>;
export declare function mapFactory<I extends object, O extends object>(): <F extends TypeMap<I, O>, RealO extends object = InferOutput<I, F, O>>(fieldMap: F) => Converter<I, RealO>;
export declare type InferConverter<I extends object, T extends TypeMap<I, O>, O extends object = InferOutput<I, T>> = Converter<I, O>;
export declare type TypeMap<I extends object = any, O extends object = any> = {
    [key in keyof O]: boolean | keyof I | Converter<I, O[key]> | PropertyMapper<I, O, key> | PropertyConverter<I, O, key>;
};
export declare type InferOutput<I extends object, T extends TypeMap<I, O>, O extends object = any> = {
    [key in keyof T]-?: T[key] extends true ? I[Extract<key, keyof I>] : T[key] extends keyof I ? I[T[key]] : T[key] extends Converter<I, infer OT> ? OT : T[key] extends Partial<Record<string, infer OT>> ? OT extends Converter<any, infer OKT> ? OKT : never : T[key] extends readonly [Converter<any, infer R>] ? R : never;
};
