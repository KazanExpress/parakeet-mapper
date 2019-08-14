import { isFlag, isConverter, isPropKey, isPropMapper, typedKeyOf } from '../src/util';

test('isFlag', () => {
  const flag = true;
  const nonflag = 'true';

  expect(isFlag(flag)).toBe(true);
  expect(isFlag(nonflag)).toBe(false);
});

test('isConverter', () => {
  const converter = (a) => a;
  const nonconverter = '(a) => a';

  expect(isConverter(converter)).toBe(true);
  expect(isConverter(nonconverter)).toBe(false);
});

test('isPropKey', () => {
  const propKey = 'key';
  const nonpropKey = true;

  expect(isPropKey(propKey)).toBe(true);
  expect(isPropKey(nonpropKey)).toBe(false);
});

test('isPropMapper', () => {
  const propMapper = { foo: String };
  const nonpropMapper = true;
  const nonpropMapper2 = { foo: true };

  expect(isPropMapper<any, any>(propMapper)).toBe(true);
  expect(isPropMapper<any, any>(nonpropMapper)).toBe(false);
  expect(isPropMapper<any, any>(nonpropMapper2)).toBe(false);
});

test('typedKeyOf', () => {
  const obj = {
    a: 0,
    b: 1,
    c: 2
  };

  expect(typedKeyOf(obj)).toMatchObject(['a', 'b', 'c']);

  const key: Array<keyof typeof obj> = typedKeyOf(obj);

  expect(Array.isArray(key)).toBe(true);
});
