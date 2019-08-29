import { Converter } from './util';
export declare type StripPromises<O> = O[keyof O] extends Promise<any> ? {
    [key in keyof O]: O[key] extends Promise<infer OK> ? OK : O[key] extends Array<Promise<infer OK>> ? Array<OK> : O[key];
} : O;
export declare type FlattenPromises<T> = T[keyof T] extends Promise<any> ? Promise<StripPromises<T>> : T;
export declare function flattenPromises<T>(obj: T): FlattenPromises<T>;
export declare function wait<I, O>(convert: Converter<I, O>): Converter<I, FlattenPromises<O>>;
