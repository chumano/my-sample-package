#!/usr/bin/env node

/**
 * Version Management Script
 * Manages semantic versioning for npm packages
 * 
 * Usage:
 *   node scripts/version.js patch   # 1.0.0 -> 1.0.1
 *   node scripts/version.js minor   # 1.0.0 -> 1.1.0
 *   node scripts/version.js major   # 1.0.0 -> 2.0.0
 *   node scripts/version.js current # Show current version
 *   node scripts/version.js help    # Show help
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to colorize console output
function colorLog(color, message) {
  console.log(colors[color] + message + colors.reset);
}

// Get package.json path
const packageJsonPath = path.join(process.cwd(), 'package.json');

// Read package.json
function readPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson;
  } catch (error) {
    colorLog('red', '❌ Error reading package.json: ' + error.message);
    process.exit(1);
  }
}

// Write package.json
function writePackageJson(packageJson) {
  try {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    colorLog('green', '✅ package.json updated successfully');
  } catch (error) {
    colorLog('red', '❌ Error writing package.json: ' + error.message);
    process.exit(1);
  }
}

// Parse semantic version
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) {
    throw new Error('Invalid version format: ' + version);
  }
  
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
    prerelease: match[4] || null
  };
}

// Format version object back to string
function formatVersion(versionObj) {
  let version = `${versionObj.major}.${versionObj.minor}.${versionObj.patch}`;
  if (versionObj.prerelease) {
    version += `-${versionObj.prerelease}`;
  }
  return version;
}

// Bump version based on type
function bumpVersion(currentVersion, bumpType) {
  const parsed = parseVersion(currentVersion);
  
  switch (bumpType) {
    case 'major':
      parsed.major++;
      parsed.minor = 0;
      parsed.patch = 0;
      parsed.prerelease = null;
      break;
    case 'minor':
      parsed.minor++;
      parsed.patch = 0;
      parsed.prerelease = null;
      break;
    case 'patch':
      parsed.patch++;
      parsed.prerelease = null;
      break;
    case 'premajor':
      parsed.major++;
      parsed.minor = 0;
      parsed.patch = 0;
      parsed.prerelease = 'alpha.0';
      break;
    case 'preminor':
      parsed.minor++;
      parsed.patch = 0;
      parsed.prerelease = 'alpha.0';
      break;
    case 'prepatch':
      parsed.patch++;
      parsed.prerelease = 'alpha.0';
      break;
    case 'prerelease':
      if (parsed.prerelease) {
        const parts = parsed.prerelease.split('.');
        if (parts.length === 2 && !isNaN(parseInt(parts[1]))) {
          parts[1] = (parseInt(parts[1]) + 1).toString();
          parsed.prerelease = parts.join('.');
        } else {
          parsed.prerelease = 'alpha.0';
        }
      } else {
        parsed.patch++;
        parsed.prerelease = 'alpha.0';
      }
      break;
    default:
      throw new Error('Invalid bump type: ' + bumpType);
  }
  
  return formatVersion(parsed);
}

// Run git commands if git is available
function runGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    return null;
  }
}

// Check if git is available and repository is clean
function checkGitStatus() {
  const status = runGitCommand('git status --porcelain');
  if (status === null) {
    colorLog('yellow', '⚠️  Git not available or not a git repository');
    return false;
  }
  
  if (status.length > 0) {
    colorLog('yellow', '⚠️  Git repository has uncommitted changes:');
    console.log(status);
    return false;
  }
  
  return true;
}

// Create git tag
function createGitTag(version) {
  try {
    runGitCommand(`git add package.json`);
    runGitCommand(`git commit -m "chore: bump version to ${version}"`);
    runGitCommand(`git tag v${version}`);
    colorLog('green', `✅ Created git tag: v${version}`);
    colorLog('cyan', '📝 To push changes and tags, run:');
    colorLog('cyan', '   git push && git push --tags');
  } catch (error) {
    colorLog('red', '❌ Error creating git tag: ' + error.message);
  }
}

// Show help message
function showHelp() {
  colorLog('cyan', '📦 NPM Package Version Management Script');
  console.log('');
  colorLog('bright', 'Usage:');
  console.log('  node scripts/version.js <bump_type> [options]');
  console.log('');
  colorLog('bright', 'Bump Types:');
  console.log('  patch      1.0.0 -> 1.0.1  (Bug fixes)');
  console.log('  minor      1.0.0 -> 1.1.0  (New features)');
  console.log('  major      1.0.0 -> 2.0.0  (Breaking changes)');
  console.log('  prepatch   1.0.0 -> 1.0.1-alpha.0');
  console.log('  preminor   1.0.0 -> 1.1.0-alpha.0');
  console.log('  premajor   1.0.0 -> 2.0.0-alpha.0');
  console.log('  prerelease 1.0.1-alpha.0 -> 1.0.1-alpha.1');
  console.log('');
  colorLog('bright', 'Commands:');
  console.log('  current    Show current version');
  console.log('  help       Show this help message');
  console.log('');
  colorLog('bright', 'Options:');
  console.log('  --no-git   Skip git operations (commit and tag)');
  console.log('  --dry-run  Show what would happen without making changes');
  console.log('');
  colorLog('bright', 'Examples:');
  console.log('  node scripts/version.js patch');
  console.log('  node scripts/version.js minor --no-git');
  console.log('  node scripts/version.js major --dry-run');
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const bumpType = args[0];
  const options = {
    noGit: args.includes('--no-git'),
    dryRun: args.includes('--dry-run')
  };

  // Show help
  if (!bumpType || bumpType === 'help') {
    showHelp();
    return;
  }

  // Read current package.json
  const packageJson = readPackageJson();
  const currentVersion = packageJson.version;

  // Show current version
  if (bumpType === 'current') {
    colorLog('cyan', `📦 Current version: ${currentVersion}`);
    return;
  }

  // Validate bump type
  const validBumpTypes = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
  if (!validBumpTypes.includes(bumpType)) {
    colorLog('red', `❌ Invalid bump type: ${bumpType}`);
    colorLog('yellow', 'Valid types: ' + validBumpTypes.join(', '));
    process.exit(1);
  }

  try {
    // Calculate new version
    const newVersion = bumpVersion(currentVersion, bumpType);
    
    // Show version change
    colorLog('cyan', `📦 Version change: ${currentVersion} -> ${newVersion}`);
    
    if (options.dryRun) {
      colorLog('yellow', '🔍 Dry run mode - no changes made');
      return;
    }

    // Check git status if git operations are enabled
    let canUseGit = false;
    if (!options.noGit) {
      canUseGit = checkGitStatus();
    }

    // Update package.json
    packageJson.version = newVersion;
    writePackageJson(packageJson);

    // Update version in source code if needed
    const indexTsPath = path.join(process.cwd(), 'src', 'index.ts');
    if (fs.existsSync(indexTsPath)) {
      let content = fs.readFileSync(indexTsPath, 'utf8');
      const versionRegex = /return\s+["'][\d\.]+([-\w\.]*)?["'];/;
      if (versionRegex.test(content)) {
        content = content.replace(versionRegex, `return "${newVersion}";`);
        fs.writeFileSync(indexTsPath, content);
        colorLog('green', '✅ Updated version in src/index.ts');
      }
    }

    // Create git commit and tag
    if (canUseGit) {
      createGitTag(newVersion);
    }

    colorLog('green', `🎉 Successfully bumped version to ${newVersion}`);
    
    // Show next steps
    colorLog('cyan', '📝 Next steps:');
    console.log('1. Run tests: npm test');
    console.log('2. Build package: npm run build');
    console.log('3. Publish: npm publish');
    
  } catch (error) {
    colorLog('red', '❌ Error: ' + error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  parseVersion,
  formatVersion,
  bumpVersion,
  readPackageJson,
  writePackageJson
};
