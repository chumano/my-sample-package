/**
 * A simple greeting function
 * @param name - The name to greet
 * @returns A greeting message
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * A simple math utility
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Get the current version of the package
 * @returns The package version
 */
export function getVersion(): string {
  return "1.0.0";
}

// Default export
export default {
  greet,
  add,
  getVersion
};
