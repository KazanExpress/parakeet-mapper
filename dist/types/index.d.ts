declare type ConverterMap<O> = {
    [key in keyof Partial<O>]: (i: O[key]) => any;
};
declare type ConvertedMap<O extends object, CM extends ConverterMap<O> = never> = {
    [key in keyof O]: key extends keyof CM ? CM extends [never] ? O[key] : ReturnType<CM[key]> : O[key];
};
export declare function mapFactory<I extends object, O extends object>(FieldMap: TypeMap<I, O>): {
    (input: I): O;
    /**
     * @param converters - a map of resulting value converters
     */
    <CM extends ConverterMap<O>>(input: I, converters: CM): ConvertedMap<O, CM>;
};
export declare function mapTypes<I extends object, O extends object>(input: I, FieldMap: TypeMap<I, O>): O;
export declare type TypeMap<I extends object = any, O extends object = any> = {
    [key in keyof Partial<O>]: boolean | keyof Partial<I> | ((obj: I) => O[key]);
};
export {};
