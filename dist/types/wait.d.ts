import { Converter } from './util';
export declare type StripPromises<O> = {
    [key in keyof O]: O[key] extends Promise<infer OK> ? OK : O[key] extends Array<Promise<infer OK>> ? Array<OK> : O[key];
};
export declare type FlattenPromises<T> = Promise<StripPromises<T>>;
export declare function flattenPromises<T>(obj: T): FlattenPromises<T>;
export declare function wait<I, O>(convert: Converter<I, O>): Converter<I, FlattenPromises<O>>;
