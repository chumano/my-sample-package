import '@types/jest';
import { greet, add, getVersion } from './index';

describe('Sample Package', () => {
  test('greet function works correctly', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  test('add function works correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('getVersion returns a valid semver version', () => {
    const version = getVersion();
    // Test that it returns a string matching semver pattern
    expect(version).toMatch(/^\d+\.\d+\.\d+(-[\w\d\-]+(\.\d+)?)?$/);
    // Test that it's not empty
    expect(version.length).toBeGreaterThan(0);
  });
});
