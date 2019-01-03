export declare function mapFactory<I extends object, O extends object>(FieldMap: TypeMap<I, O>): (input: I) => O;
export declare function mapTypes<I extends object, O extends object>(input: I, FieldMap: TypeMap<I, O>): O;
export declare type TypeMap<I extends object = any, O extends object = any> = {
    [key in keyof Partial<O>]: boolean | keyof Partial<I> | ((obj: I) => O[key]);
};
