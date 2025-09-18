import { greet, add, getVersion } from './index';

describe('Sample Package', () => {
  test('greet function works correctly', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  test('add function works correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('getVersion returns correct version', () => {
    expect(getVersion()).toBe('1.0.0');
  });
});
