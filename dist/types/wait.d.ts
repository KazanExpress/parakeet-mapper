import { Converter } from './util';
declare type StripPromises<O> = {
    [key in keyof O]: O[key] extends Promise<infer OK> ? OK : O[key];
};
declare type FlattenPromises<T> = Promise<StripPromises<T>>;
export declare function flattenPromises<T>(obj: T): FlattenPromises<T>;
export declare function wait<I, O>(convert: Converter<I, O>): Converter<I, FlattenPromises<O>>;
export {};
