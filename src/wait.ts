import { Converter } from './util';

type StripPromises<O> = {
  [key in keyof O]: O[key] extends Promise<infer OK> ? OK : O[key];
};

type FlattenPromises<T> = Promise<StripPromises<T>>;

export function flattenPromises<T>(obj: T): FlattenPromises<T> {
  const promises: Promise<void>[] = [];

  for (const key in obj) {
    const value = obj[key];

    if (value instanceof Promise) {
      promises.push(value.then(resolved => {
        obj[key] = resolved;
      }));
    }
  }

  return Promise.all(promises)
    .then(_ => obj as StripPromises<T>);
}

export function wait<I, O>(convert: Converter<I, O>): Converter<I, FlattenPromises<O>> {
  return input => flattenPromises(convert(input));
}
