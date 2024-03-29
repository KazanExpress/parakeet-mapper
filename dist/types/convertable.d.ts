import { Converter } from './util.js';
export declare type ConverterFactory<M extends any[] = any[], I = any, O = any> = (...args: M) => Converter<I, O>;
export interface IConvertableConstructor<C extends ConverterFactory, I = ReturnType<C> extends Converter<infer U> ? U : any, O = ReturnType<C> extends Converter<any, infer U> ? U : any, M extends any[] = C extends ConverterFactory<infer U> ? U : any[]> {
    /**
     * Creates an instance of Convertable.
     * @param options main options for converter function (typically, the model from server)
     * @param misc miscellanious arguments for converter function as declared in its definition
     */
    new (options: I, ...misc: M): O;
    /**
     * the converter factory to use for the convertor generation
     *
     * Can accept multiple arguments for customization. Those arguments are then transferred to the constructor after the main options.
     */
    readonly createConverter: C;
}
export interface IReverseConvertableConstructor<C extends ConverterFactory, RC extends ConverterFactory<any, O, I>, I = ReturnType<C> extends Converter<infer U> ? U : any, O = ReturnType<C> extends Converter<any, infer U> ? U : any, M extends any[] = C extends ConverterFactory<infer U> ? U : any[], MR extends any[] = RC extends ConverterFactory<infer U> ? U : any[]> extends IConvertableConstructor<C, I, O, M> {
    /**
     * Creates an instance of Convertable.
     * @param options main options for converter function (typically, the model from server)
     * @param misc miscellanious arguments for converter function as declared in its definition
     */
    new (options: I, ...misc: M): O;
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
    toInput(options: O, ...misc: MR): I;
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
export declare function Convertable<C extends ConverterFactory, I = ReturnType<C> extends Converter<infer U> ? U : any, O = ReturnType<C> extends Converter<any, infer U> ? U : any, M extends any[] = C extends ConverterFactory<infer U> ? U : any[]>(converter: C): IConvertableConstructor<C, I, O, M>;
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
export declare function Convertable<C extends ConverterFactory, RC extends ConverterFactory<any, O, I>, I = ReturnType<C> extends Converter<infer U> ? U : any, O = ReturnType<C> extends Converter<any, infer U> ? U : any, M extends any[] = C extends ConverterFactory<infer U> ? U : any[], MR extends any[] = RC extends ConverterFactory<infer U> ? U : any[]>(converter: C, reverseConverter: RC): IReverseConvertableConstructor<C, RC, I, O, M, MR>;
