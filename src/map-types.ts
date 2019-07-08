import { TypeMap, InferOutput, mapFactory } from './map-factory';

export function mapTypes<
  I extends object
>(): <
  F extends TypeMap<I, any>,
  O extends object = InferOutput<I, F>
>(input: I, FieldMap: F) => O;

export function mapTypes<
  I extends object,
  O extends object
>(): <
  F extends TypeMap<I, any>,
  RealO extends object = InferOutput<I, F, O>
>(input: I, FieldMap: F) => RealO;

export function mapTypes<
  I extends object,
  O extends object
>(input: I, FieldMap: TypeMap<I, O>): O;

export function mapTypes<
  I extends object,
  O extends object
>(input?: I, FieldMap?: TypeMap<I, O>) {
  if (!input || !FieldMap) {
    return mapTypes;
  }

  return mapFactory(FieldMap)(input);
}
