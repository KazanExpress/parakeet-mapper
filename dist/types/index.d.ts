export default function mapTypes<I extends object, O extends object>(input: I, FieldMap: TypeMap<Partial<I>, Partial<O>>): O;
export declare type TypeMap<I extends object, O extends object> = {
    [key in keyof O]: boolean | keyof I | ((obj: I) => O[key]);
};
