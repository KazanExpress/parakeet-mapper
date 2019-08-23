import { isConverter, isPropKey } from '../src/util';

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
