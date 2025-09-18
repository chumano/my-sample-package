# PowerShell Version Management Script
# Usage: .\scripts\version.ps1 patch|minor|major [--no-git] [--dry-run]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("patch", "minor", "major", "prepatch", "preminor", "premajor", "prerelease", "current", "help")]
    [string]$BumpType,
    
    [switch]$NoGit,
    [switch]$DryRun
)

# Color functions
function Write-ColorOutput($Color, $Message) {
    Write-Host $Message -ForegroundColor $Color
}

function Write-Success($Message) { Write-ColorOutput Green $Message }
function Write-Error($Message) { Write-ColorOutput Red $Message }
function Write-Warning($Message) { Write-ColorOutput Yellow $Message }
function Write-Info($Message) { Write-ColorOutput Cyan $Message }

# Show help
if ($BumpType -eq "help") {
    Write-Info "📦 NPM Package Version Management Script (PowerShell)"
    Write-Host ""
    Write-Host "Usage: .\scripts\version.ps1 <bump_type> [options]" -ForegroundColor White
    Write-Host ""
    Write-Host "Bump Types:" -ForegroundColor White
    Write-Host "  patch      1.0.0 -> 1.0.1  (Bug fixes)"
    Write-Host "  minor      1.0.0 -> 1.1.0  (New features)"
    Write-Host "  major      1.0.0 -> 2.0.0  (Breaking changes)"
    Write-Host "  prepatch   1.0.0 -> 1.0.1-alpha.0"
    Write-Host "  preminor   1.0.0 -> 1.1.0-alpha.0"
    Write-Host "  premajor   1.0.0 -> 2.0.0-alpha.0"
    Write-Host "  prerelease 1.0.1-alpha.0 -> 1.0.1-alpha.1"
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  current    Show current version"
    Write-Host "  help       Show this help message"
    Write-Host ""
    Write-Host "Options:" -ForegroundColor White
    Write-Host "  -NoGit     Skip git operations"
    Write-Host "  -DryRun    Show what would happen without making changes"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\scripts\version.ps1 patch"
    Write-Host "  .\scripts\version.ps1 minor -NoGit"
    Write-Host "  .\scripts\version.ps1 major -DryRun"
    return
}

try {
    # Read package.json
    $packageJsonPath = "package.json"
    if (-not (Test-Path $packageJsonPath)) {
        Write-Error "❌ package.json not found in current directory"
        exit 1
    }

    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    $currentVersion = $packageJson.version

    # Show current version
    if ($BumpType -eq "current") {
        Write-Info "📦 Current version: $currentVersion"
        return
    }

    # Use npm version command for version bumping
    $versionCommand = "npm version $BumpType --no-git-tag-version"
    
    if ($DryRun) {
        Write-Warning "🔍 Dry run mode - showing what would happen:"
        Write-Info "Command: $versionCommand"
        
        # Calculate what the new version would be
        $tempResult = npm version $BumpType --no-git-tag-version --dry-run 2>$null
        if ($tempResult) {
            Write-Info "📦 Version would change: $currentVersion -> $($tempResult -replace 'v', '')"
        }
        return
    }

    # Check git status if git operations are enabled
    $canUseGit = $false
    if (-not $NoGit) {
        try {
            $gitStatus = git status --porcelain 2>$null
            if ($LASTEXITCODE -eq 0) {
                if ($gitStatus) {
                    Write-Warning "⚠️  Git repository has uncommitted changes:"
                    Write-Host $gitStatus
                } else {
                    $canUseGit = $true
                }
            } else {
                Write-Warning "⚠️  Git not available or not a git repository"
            }
        } catch {
            Write-Warning "⚠️  Git not available"
        }
    }

    # Bump the version
    Write-Info "📦 Bumping version from $currentVersion..."
    $result = Invoke-Expression $versionCommand
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Failed to bump version"
        exit 1
    }

    # Get the new version
    $newPackageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    $newVersion = $newPackageJson.version

    Write-Success "✅ Version updated to: $newVersion"

    # Update version in source code if needed
    $indexTsPath = "src\index.ts"
    if (Test-Path $indexTsPath) {
        $content = Get-Content $indexTsPath -Raw
        if ($content -match 'return ["\'][\d\.]+([-\w\.]*)?["\'];.*getVersion') {
            $updatedContent = $content -replace 'return ["\'][\d\.]+([-\w\.]*)?["\'];(.*)getVersion', "return `"$newVersion`";`$1getVersion"
            Set-Content $indexTsPath -Value $updatedContent -NoNewline
            Write-Success "✅ Updated version in src\index.ts"
        }
    }

    # Create git commit and tag
    if ($canUseGit) {
        try {
            git add package.json
            if (Test-Path $indexTsPath) {
                git add $indexTsPath
            }
            git commit -m "chore: bump version to $newVersion"
            git tag "v$newVersion"
            Write-Success "✅ Created git commit and tag: v$newVersion"
            Write-Info "📝 To push changes and tags, run:"
            Write-Info "   git push"
            Write-Info "   git push --tags"
        } catch {
            Write-Error "❌ Error creating git commit/tag: $_"
        }
    }

    Write-Success "🎉 Successfully bumped version to $newVersion"
    
    # Show next steps
    Write-Info "📝 Next steps:"
    Write-Host "1. Run tests: npm test"
    Write-Host "2. Build package: npm run build"
    Write-Host "3. Publish: npm publish"

} catch {
    Write-Error "❌ Error: $_"
    exit 1
}
