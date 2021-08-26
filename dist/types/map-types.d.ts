import { TypeMap, InferOutput } from './map-factory.js';
export declare function mapTypes<I extends object>(): <F extends TypeMap<I>, O extends object = InferOutput<I, F>>(input: I, FieldMap: F) => O;
export declare function mapTypes<I extends object, O extends object>(): <F extends TypeMap<I>, RealO extends object = InferOutput<I, F, O>>(input: I, FieldMap: F) => RealO;
export declare function mapTypes<I extends object, O extends object>(input: I, FieldMap: TypeMap<I, O>): O;
