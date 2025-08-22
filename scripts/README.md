# Scripts Directory

This directory contains all utility scripts organized by category.

## Directory Structure

```
scripts/
├── fixes/      # Bug fixes and enhancement scripts
├── tests/      # Testing and validation scripts  
├── utils/      # Data extraction and utility scripts
└── README.md   # This file
```

## 🔧 Fixes (`fixes/`)

Scripts that fix bugs and enhance the tactile.js library:

- `enhance-curve-aggressiveness.js` - Enhances curve rendering aggressiveness
- `fix-canvas-utilization.js` - Fixes canvas scaling and positioning
- `fix-curve-generation.js` - Fixes curve generation algorithms
- `fix-missing-function.js` - Fixes missing function implementations
- `fix-scaling-issue.js` - Fixes scaling calculation issues
- `fix-tiling-corruption.js` - Fixes tiling data corruption
- `implement-dynamic-curves.js` - Implements dynamic curve system
- `quick-direct-fix.js` - Quick direct fixes for common issues
- `targeted-overlap-fix.js` - Fixes curve overlap issues

## 🧪 Tests (`tests/`)

Scripts for testing and validation:

- `run-comprehensive-test.js` - Comprehensive testing of all tiling types
- `run-test-and-capture.js` - Test runner with result capture
- `test-curve-fix-only.js` - Tests only curve-related fixes

## 🔧 Utils (`utils/`)

Utility scripts for data processing and analysis:

- `audit-tiling-data.js` - Audits tiling data integrity
- `create-data-snapshot.js` - Creates data snapshots
- `extract-data-v2.js` - Enhanced data extraction
- `extract-data.js` - Basic data extraction

## Usage

All scripts are executable Node.js scripts. Run with:

```bash
node scripts/category/script-name.js
```

For example:
```bash
node scripts/fixes/fix-canvas-utilization.js
node scripts/tests/run-comprehensive-test.js
node scripts/utils/audit-tiling-data.js
```
