import { Converter } from './util';

export type ConverterFactory<
  M extends any[] = any[],
  T extends object = any,
  R extends object = any
> = (...args: M) => Converter<T, R>;

export interface IConvertableConstructor<
  C extends ConverterFactory,
  I extends object = ReturnType<C> extends Converter<infer U> ? U : any,
  R extends object = ReturnType<C> extends Converter<any, infer U> ? U : any,
  M extends any[] = C extends ConverterFactory<infer U> ? U : any[]
> {
  /**
   * Creates an instance of Convertable.
   * @param options main options for converter function (typically, the model from server)
   * @param misc miscellanious arguments for converter function as declared in its definition
   */
  new (options: I, ...misc: M): R;

  /**
   * the converter factory to use for the convertor generation
   *
   * Can accept multiple arguments for customization. Those arguments are then transferred to the constructor after the main options.
   */
  readonly createConverter: C;
}

export interface IReverseConvertableConstructor<
  C extends ConverterFactory,
  RC extends ConverterFactory<any, R, I>,
  I extends object = ReturnType<C> extends Converter<infer U> ? U : any,
  R extends object = ReturnType<C> extends Converter<any, infer U> ? U : any,
  M extends any[] = C extends ConverterFactory<infer U> ? U : any[],
  MR extends any[] = RC extends ConverterFactory<infer U> ? U : any[]
> extends IConvertableConstructor<C, I, R, M> {
  /**
   * Creates an instance of Convertable.
   * @param options main options for converter function (typically, the model from server)
   * @param misc miscellanious arguments for converter function as declared in its definition
   */
  new (options: I, ...misc: M): R;

  /**
   * reverseConverter has the same signature as the `converter`, used for the reverse conversion back to server types
   *
   * Can accept multiple arguments for customization. Those arguments are then transferred to the constructor after the main options.
   */
  readonly reverseConverter: RC;

  /**
   * Converts passed data back to input model using the reverse converter, if any was passed into the `@Convertable` decorator.
   *
   * @param options initially converted output to generate resulting input from
   * @param misc miscellanious arguments for reverseConverter function as declared in its definition
   */
  toInput(options: R, ...misc: MR): I;
}

/**
 * Makes class convertible: adds the ability to convert certain options
 * to the class using its constructor
 *
 * @param converter the converter factory to use for the convertor generation
 *
 * Can accept multiple arguments for customization. Those arguments are then transferred to the constructor after the main options.
 *
 * @returns newly generated convertable class
*/
export function Convertable<
  C extends ConverterFactory,
  I extends object = ReturnType<C> extends Converter<infer U> ? U : any,
  R extends object = ReturnType<C> extends Converter<any, infer U> ? U : any,
  M extends any[] = C extends ConverterFactory<infer U> ? U : any[]
>(converter: C): IConvertableConstructor<C, I, R, M>;

/**
 * Makes class convertible: adds the ability to convert certain options
 * to the class using its constructor
 *
 * @param converter the converter factory to use for the convertor generation
 *
 * Can accept multiple arguments for customization. Those arguments are then transferred to the constructor after the main options.
 *
 * @param reverseConverter has the same signature as the `converter`, used for the reverse conversion back to server types
 *
 * @returns newly generated convertable class
*/
export function Convertable<
  C extends ConverterFactory,
  RC extends ConverterFactory<any, R, I>,
  I extends object = ReturnType<C> extends Converter<infer U> ? U : any,
  R extends object = ReturnType<C> extends Converter<any, infer U> ? U : any,
  M extends any[] = C extends ConverterFactory<infer U> ? U : any[],
  MR extends any[] = RC extends ConverterFactory<infer U> ? U : any[]
>(converter: C, reverseConverter: RC): IReverseConvertableConstructor<C, RC, I, R, M, MR>;

export function Convertable<
  C extends ConverterFactory,
  I extends object = ReturnType<C> extends Converter<infer U> ? U : any,
  R extends object = ReturnType<C> extends Converter<any, infer U> ? U : any,
  M extends any[] = C extends ConverterFactory<infer U> ? U : any[],

  RC extends ConverterFactory<any, R, I> = never,
  MR extends any[] = RC extends ConverterFactory<infer U> ? U : never
>(converter: C, reverseConverter?: RC) {
  class Convertable {
    constructor(options: I, ...misc: M) {
      const converted = converter(...misc)(options);

      for (const key in converted) {
        this[key] = converted[key];
      }
    }

    public static toInput = reverseConverter ? <Obj extends R>(options: Obj, ...misc: MR) => (
      reverseConverter(...misc)(options)
     ) : undefined;

    public static readonly createConverter = converter;

    public static readonly reverseConverter = reverseConverter;
  }

  return Convertable;
}
