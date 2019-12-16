import { isFactory, isPropKey } from '../src/util';

test('isFactory', () => {
  const converter = (a) => a;
  const nonconverter = '(a) => a';

  expect(isFactory(converter)).toBe(true);
  expect(isFactory(nonconverter)).toBe(false);
});

test('isPropKey', () => {
  const propKey = 'key';
  const nonpropKey = true;

  expect(isPropKey(propKey)).toBe(true);
  expect(isPropKey(nonpropKey)).toBe(false);
});
