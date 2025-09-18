# Complete Guide: Building and Publishing an NPM Package

This guide will walk you through creating, building, and publishing your first npm package from scratch.

## Prerequisites

Before you start, make sure you have:
- [Node.js](https://nodejs.org/) installed (version 14 or higher recommended)
- npm installed (comes with Node.js)
- An [npmjs.com](https://www.npmjs.com/) account

## Step 1: Verify Your Environment

First, check that Node.js and npm are properly installed:

```bash
node --version
npm --version
```

## Step 2: Create Your Project Directory

```bash
mkdir my-sample-package
cd my-sample-package
```

## Step 3: Initialize Your Package

Initialize a new npm package with the interactive setup:

```bash
npm init
```

Or use the quick setup with defaults:

```bash
npm init -y
```

This creates a `package.json` file with basic information about your package.

## Step 4: Edit package.json

Open `package.json` and customize it. Here's a sample configuration:

```json
{
  "name": "@yourusername/my-sample-package",
  "version": "1.0.0",
  "description": "A sample npm package for demonstration",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "prepublishOnly": "npm run build",
    "dev": "tsc --watch"
  },
  "keywords": ["sample", "npm", "package", "demo"],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-sample-package.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/my-sample-package/issues"
  },
  "homepage": "https://github.com/yourusername/my-sample-package#readme",
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^18.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  },
  "files": [
    "dist/**/*"
  ]
}
```

**Important fields explained:**
- `name`: Use `@yourusername/package-name` format for scoped packages
- `main`: Entry point of your package
- `types`: TypeScript declaration file location
- `files`: Specify which files to include in the published package
- `prepublishOnly`: Script that runs before publishing

## Step 5: Set Up TypeScript (Recommended)

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## Step 6: Install Development Dependencies

```bash
npm install --save-dev typescript @types/node jest @types/jest
```

## Step 7: Create Your Source Code

Create the `src` directory and your main file:

```bash
mkdir src
```

Create `src/index.ts`:

```typescript
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
```

## Step 8: Create Tests (Optional but Recommended)

Create `src/index.test.ts`:

```typescript
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
```

Configure Jest by adding this to your `package.json`:

```json
"jest": {
  "preset": "ts-jest",
  "testEnvironment": "node"
}
```

Install additional Jest dependencies:

```bash
npm install --save-dev ts-jest
```

## Step 9: Create Additional Files

### README.md
Create a comprehensive README:

```markdown
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
```

### .gitignore
Create `.gitignore`:

```
node_modules/
dist/
*.log
.DS_Store
.env
coverage/
```

### .npmignore
Create `.npmignore`:

```
src/
*.test.ts
tsconfig.json
jest.config.js
.gitignore
coverage/
```

### LICENSE
Create a `LICENSE` file (for MIT license):

```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Step 10: Build Your Package

Build the TypeScript code:

```bash
npm run build
```

This will create a `dist` folder with your compiled JavaScript and declaration files.

## Step 11: Test Your Package Locally

Test your package before publishing:

```bash
npm test
```

Test the built package locally:

```bash
npm pack
# package to ./pack folder
npm pack ./pack

```


This creates a `.tgz` file that you can install in another project to test:

```bash
npm install /path/to/your-package-1.0.0.tgz
```

## Step 12: Create an npm Account

If you don't have an npm account:
1. Go to [npmjs.com](https://www.npmjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 13: Login to npm

```bash
npm login
```

Enter your npm credentials when prompted.

## Step 14: Publish Your Package

Before publishing, make sure:
- Your package builds successfully
- All tests pass
- You've updated the version number if needed

Publish your package:

```bash
npm publish --access public
```

**Note:** Use `--access public` for scoped packages (@username/package-name) to make them publicly available.

## Step 15: Verify Publication

Check that your package was published:

```bash
npm view @yourusername/my-sample-package
```

Visit your package page: `https://www.npmjs.com/package/@yourusername/my-sample-package`

## Step 16: Update Your Package

When you make changes:

1. Update your code
2. Run tests: `npm test`
3. Build: `npm run build`
4. Update version: `npm version patch` (or `minor`, `major`)
5. Publish: `npm publish`

## Version Management

npm follows semantic versioning (semver):
- `patch`: Bug fixes (1.0.0 → 1.0.1)
- `minor`: New features, backwards compatible (1.0.0 → 1.1.0)
- `major`: Breaking changes (1.0.0 → 2.0.0)

```bash
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0
```

## Best Practices

1. **Use TypeScript** for better development experience
2. **Write tests** to ensure reliability
3. **Follow semantic versioning** for version management
4. **Write good documentation** in your README
5. **Use meaningful commit messages** if using Git
6. **Keep your package focused** - do one thing well
7. **Use scoped packages** (@username/package-name) to avoid naming conflicts
8. **Include only necessary files** using the `files` field in package.json
9. **Use .npmignore** to exclude development files
10. **Test your package** locally before publishing

## Troubleshooting

### Common Issues:

**Package name already exists:**
- Use a scoped package name: `@yourusername/package-name`
- Choose a unique name

**Permission denied:**
- Make sure you're logged in: `npm whoami`
- Check if you have publish rights for scoped packages

**Build errors:**
- Check your TypeScript configuration
- Ensure all dependencies are installed

**Tests failing:**
- Make sure Jest is properly configured
- Check that all test files are correctly written

## Conclusion

Congratulations! You've successfully created and published your first npm package. Your package is now available for anyone to install and use.

Remember to maintain your package by:
- Fixing bugs promptly
- Adding new features based on user feedback
- Keeping dependencies updated
- Responding to issues and pull requests (if using GitHub)

Happy coding! 🚀
