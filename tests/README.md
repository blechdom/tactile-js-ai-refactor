# Tactile-JS Safe Refactor - Test Suite

This directory contains all tests for the Tactile-JS safe refactoring project. Tests are organized by type and environment for easy maintenance and reuse.

## 📁 Test Structure

```
tests/
├── browser/           # Browser-based tests
│   ├── test-browser.html              # Comprehensive browser test
│   ├── test-browser-simple.html       # Simple browser test
│   ├── serve.py                       # Python HTTP server
│   └── serve-test.js                  # Node.js HTTP server
├── node/              # Node.js tests
│   ├── test-data-loader.js            # TilingDataLoader tests
│   ├── verify-data-extraction.js      # Data extraction verification
│   └── extract-data-final.js          # Data extraction script
├── integration/       # Integration tests
│   └── (future integration tests)
└── README.md          # This file
```

## 🧪 Available Test Suites

### Browser Tests (`tests/browser/`)

#### 1. Simple Browser Test
- **File**: `test-browser-simple.html`
- **Purpose**: Quick verification of basic functionality
- **Tests**:
  - ES module imports (EdgeShape, TilingDataLoader)
  - TilingDataLoader initialization
  - Basic data retrieval
  - Sample tiling type information
- **Usage**: Open in browser after starting server

#### 2. Comprehensive Browser Test
- **File**: `test-browser.html`
- **Purpose**: Full functionality testing with detailed reporting
- **Tests**:
  - Complete data integrity validation
  - Performance testing
  - Edge shape functionality
  - Parameter functionality
  - Statistical analysis
- **Usage**: Open in browser after starting server

#### 3. Test Servers
- **Python Server**: `serve.py` (recommended)
- **Node.js Server**: `serve-test.js`
- **Port**: 8888
- **Features**: CORS enabled, ES6 module support

### Node.js Tests (`tests/node/`)

#### 1. Data Loader Test
- **File**: `test-data-loader.js`
- **Purpose**: Test TilingDataLoader functionality in Node.js
- **Tests**:
  - Initialization and statistics
  - Data integrity validation
  - Tiling type retrieval
  - Edge shape functionality
  - Parameter functionality
  - Performance testing
- **Usage**: `node tests/node/test-data-loader.js`

#### 2. Data Extraction Verification
- **File**: `verify-data-extraction.js`
- **Purpose**: Verify data extraction completeness and accuracy
- **Tests**:
  - Data array counts
  - Data integrity checks
  - Tiling type definitions
  - Cross-reference validation
- **Usage**: `node tests/node/verify-data-extraction.js`

#### 3. Data Extraction Script
- **File**: `extract-data-final.js`
- **Purpose**: Extract data from original tactile.js
- **Output**: Complete TilingData.js file
- **Usage**: `node tests/node/extract-data-final.js`

## 🚀 Quick Start

### Running Browser Tests

1. **Start the test server**:
   ```bash
   cd safe-refactor
   python3 tests/browser/serve.py
   ```

2. **Open browser tests**:
   - Simple: http://localhost:8888/tests/browser/test-browser-simple.html
   - Comprehensive: http://localhost:8888/tests/browser/test-browser.html

### Running Node.js Tests

```bash
cd safe-refactor

# Test data loader
node tests/node/test-data-loader.js

# Verify data extraction
node tests/node/verify-data-extraction.js

# Re-extract data (if needed)
node tests/node/extract-data-final.js
```

## 📊 Test Coverage

### ✅ Data Extraction
- [x] All 345 data arrays extracted
- [x] 81 valid tiling types identified
- [x] Data integrity verification
- [x] Cross-reference validation

### ✅ Module System
- [x] ES6 module imports/exports
- [x] Browser compatibility
- [x] Node.js compatibility
- [x] CORS support

### ✅ Core Functionality
- [x] TilingDataLoader initialization
- [x] Tiling type retrieval
- [x] Edge shape constants
- [x] Parameter validation
- [x] Performance benchmarks

### 🔄 Integration Testing (Future)
- [ ] Original demo compatibility
- [ ] Visual rendering verification
- [ ] Behavioral equivalence testing
- [ ] Performance comparison

## 🛠️ Test Maintenance

### Adding New Tests

1. **Browser Tests**: Add to `tests/browser/`
2. **Node.js Tests**: Add to `tests/node/`
3. **Integration Tests**: Add to `tests/integration/`

### Test Naming Convention

- **Browser**: `test-[feature]-browser.html`
- **Node.js**: `test-[feature].js`
- **Integration**: `test-[feature]-integration.js`
- **Utilities**: `[utility-name].js`

### Updating Existing Tests

When modifying the library:
1. Run existing tests first to ensure no regressions
2. Update tests if API changes
3. Add new tests for new functionality
4. Document any test changes

## 🔧 Configuration

### Test Server Settings
- **Port**: 8888 (configurable in server files)
- **CORS**: Enabled for all origins
- **MIME Types**: Proper JavaScript module support
- **Caching**: Disabled for development

### Node.js Test Settings
- **ES Modules**: Enabled via package.json type: "module"
- **Import Paths**: Relative to safe-refactor root
- **Output**: Colored console output with status indicators

## 📈 Performance Benchmarks

### Expected Performance
- **Data Loading**: < 100ms
- **Initialization**: < 50ms
- **Type Retrieval**: < 1ms per type
- **Memory Usage**: ~2-5MB total

### Performance Tests
- Initialization timing
- Memory usage tracking
- Bulk operation benchmarks
- Comparison with original library

## 🐛 Troubleshooting

### Common Issues

1. **Module Loading Errors**:
   - Check file paths in import statements
   - Ensure server is running for browser tests
   - Verify package.json type: "module"

2. **Data Loading Issues**:
   - Run data extraction verification
   - Check TilingData.js completeness
   - Verify import paths in TilingDataLoader.js

3. **Server Issues**:
   - Ensure port 8888 is available
   - Check CORS headers for browser tests
   - Run from correct directory

### Debug Mode

Add `DEBUG=true` environment variable for verbose output:
```bash
DEBUG=true node tests/node/test-data-loader.js
```

## 📝 Test Results

All tests generate detailed output including:
- ✅/❌ Status indicators
- Performance metrics
- Error details and stack traces
- Statistical summaries
- Debugging information

This comprehensive test suite ensures the refactored library maintains full compatibility while providing improved modularity and maintainability.
