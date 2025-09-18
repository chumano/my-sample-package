# My Sample Package

A sample npm package for demonstration purposes.

## Installation

```bash
npm install @yourusername/my-sample-package
```

## Usage

```javascript
const { greet, add } = require('@yourusername/my-sample-package');

console.log(greet('World')); // "Hello, World!"
console.log(add(2, 3)); // 5
```

### ES6 Modules

```javascript
import { greet, add } from '@yourusername/my-sample-package';

console.log(greet('World')); // "Hello, World!"
console.log(add(2, 3)); // 5
```

## API

### `greet(name: string): string`
Returns a greeting message.

### `add(a: number, b: number): number`
Returns the sum of two numbers.

## License

MIT
