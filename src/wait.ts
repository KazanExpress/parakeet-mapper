import { Converter } from './util';

type StripPromises<O> = {
  [key in keyof O]: O[key] extends Promise<infer OK> ? OK : O[key];
};

export function flattenPromises<T>(obj: T): Promise<StripPromises<T>> {
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

export function wait<I, O>(convert: Converter<I, O>): Converter<I, Promise<StripPromises<O>>> {
  return input => flattenPromises(convert(input));
}