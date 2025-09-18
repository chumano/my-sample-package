# Version Management Scripts

This package includes comprehensive version management scripts that follow semantic versioning (semver) principles.

## 📋 Overview

The version management system provides:
- **Automatic version bumping** following semver rules
- **Git integration** with automatic commits and tags
- **Source code updates** to keep version strings in sync
- **Cross-platform support** (Node.js and PowerShell)
- **Dry-run mode** to preview changes
- **Comprehensive validation** and error handling

## 🚀 Quick Start

### Using npm scripts (Recommended)
```bash
# Patch version (1.0.0 -> 1.0.1) - for bug fixes
npm run version:patch

# Minor version (1.0.0 -> 1.1.0) - for new features
npm run version:minor

# Major version (1.0.0 -> 2.0.0) - for breaking changes
npm run version:major

# Check current version
npm run version:current

# Get help
npm run version:help
```

### Using scripts directly

#### Node.js script (Cross-platform)
```bash
# Basic usage
node scripts/version.js patch
node scripts/version.js minor
node scripts/version.js major

# With options
node scripts/version.js patch --dry-run    # Preview changes
node scripts/version.js minor --no-git     # Skip git operations
node scripts/version.js current            # Show current version
node scripts/version.js help               # Show help
```

#### PowerShell script (Windows)
```powershell
# Basic usage
.\scripts\version.ps1 patch
.\scripts\version.ps1 minor
.\scripts\version.ps1 major

# With options
.\scripts\version.ps1 patch -DryRun    # Preview changes
.\scripts\version.ps1 minor -NoGit     # Skip git operations
.\scripts\version.ps1 current          # Show current version
.\scripts\version.ps1 help             # Show help
```

## 📊 Semantic Versioning Rules

| Bump Type | Version Change | When to Use | Example |
|-----------|----------------|-------------|---------|
| `patch` | 1.0.0 → 1.0.1 | Bug fixes, patches | Fix memory leak |
| `minor` | 1.0.0 → 1.1.0 | New features (backwards compatible) | Add new API method |
| `major` | 1.0.0 → 2.0.0 | Breaking changes | Change API signature |
| `prepatch` | 1.0.0 → 1.0.1-alpha.0 | Pre-release patch | Beta bug fix |
| `preminor` | 1.0.0 → 1.1.0-alpha.0 | Pre-release minor | Beta new feature |
| `premajor` | 1.0.0 → 2.0.0-alpha.0 | Pre-release major | Beta breaking change |
| `prerelease` | 1.0.1-alpha.0 → 1.0.1-alpha.1 | Increment pre-release | Next beta version |

## 🔄 Complete Release Workflow

### Automated Release (Recommended)
```bash
# Test, build, version bump, and publish in one command
npm run release:patch    # For patch releases
npm run release:minor    # For minor releases  
npm run release:major    # For major releases
```

### Manual Release Workflow
```bash
# 1. Make your changes and commit them
git add .
git commit -m "feat: add new awesome feature"

# 2. Run tests
npm test

# 3. Build the package
npm run build

# 4. Bump version (this will also create git tag)
npm run version:minor

# 5. Push changes and tags
git push && git push --tags

# 6. Publish to npm
npm publish
```

## ⚙️ What the Scripts Do

### Automatic Actions
1. **Read current version** from package.json
2. **Calculate new version** based on bump type
3. **Update package.json** with new version
4. **Update source code** (src/index.ts getVersion function)
5. **Create git commit** with version message
6. **Create git tag** (v1.0.1, v1.1.0, etc.)
7. **Show next steps** and helpful information

### Git Integration
- Creates descriptive commit messages: `"chore: bump version to 1.0.1"`
- Creates version tags: `v1.0.1`, `v1.1.0`, etc.
- Checks for uncommitted changes before proceeding
- Provides push instructions after tagging

## 🛠️ Configuration Options

### Command Line Options
- `--dry-run` - Preview changes without making them
- `--no-git` - Skip git operations (commit and tag creation)

### Environment Requirements
- **Node.js** (for the main script)
- **Git** (optional, for version tagging)
- **PowerShell** (for Windows-specific script)

## 📝 Examples

### Standard Version Bumps
```bash
# Current version: 1.2.3

npm run version:patch   # → 1.2.4 (bug fixes)
npm run version:minor   # → 1.3.0 (new features)
npm run version:major   # → 2.0.0 (breaking changes)
```

### Pre-release Versions
```bash
# Current version: 1.0.0

node scripts/version.js prepatch     # → 1.0.1-alpha.0
node scripts/version.js prerelease   # → 1.0.1-alpha.1
node scripts/version.js prerelease   # → 1.0.1-alpha.2
node scripts/version.js patch        # → 1.0.1 (removes pre-release)
```

### Dry Run Mode
```bash
# See what would happen without making changes
npm run version:minor -- --dry-run
node scripts/version.js major --dry-run
.\scripts\version.ps1 patch -DryRun
```

## 🔍 Troubleshooting

### Common Issues

**"Git repository has uncommitted changes"**
- Commit or stash your changes before version bumping
- Or use `--no-git` to skip git operations

**"Invalid version format"**
- Ensure package.json has a valid semver version
- Version should follow pattern: `major.minor.patch`

**"Permission denied" on npm publish**
- Make sure you're logged in: `npm whoami`
- Check if you have publish rights for scoped packages

### Error Messages
The scripts provide detailed, colorized error messages to help diagnose issues quickly.

## 🎯 Best Practices

1. **Always run tests** before version bumping
2. **Use semantic versioning** correctly based on change type
3. **Write good commit messages** before version bumping
4. **Use dry-run mode** to preview changes
5. **Keep pre-releases organized** with meaningful identifiers
6. **Document breaking changes** in major version updates

## 🔧 Customization

The scripts can be customized by modifying:
- `scripts/version.js` - Main Node.js script
- `scripts/version.ps1` - PowerShell script
- `package.json` scripts section - npm script aliases

## 📚 Additional Resources

- [Semantic Versioning Specification](https://semver.org/)
- [npm version command](https://docs.npmjs.com/cli/v8/commands/npm-version)
- [Git tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
