# Tactile-JS Behavior Documentation

## Overview
This document records the exact behavior of each tiling type in the original Tactile-JS library before any refactoring. This serves as our "ground truth" to ensure refactoring doesn't break functionality.

## Test Environment Setup
- **Test Page**: `test-environment.html`
- **Original Library**: `lib/tactile.js`
- **Demo Page**: `demo/autodemo.html`

## Tiling Type Documentation Template

### Tiling Type [X]

#### Basic Properties
- **Vertices**: [number]
- **Aspects**: [number]
- **Edge Shapes**: [number]
- **Parameters**: [array of numbers]

#### Translation Vectors
- **T1**: (x, y)
- **T2**: (x, y)

#### Visual Characteristics
- **Shape**: [triangle/square/hexagon/other]
- **Symmetry**: [description]
- **Edge Types**: [J/U/S/I combinations]
- **Color Patterns**: [description]

#### Special Behaviors
- **Parameter Sensitivity**: [how parameters affect the pattern]
- **Edge Variations**: [how edges change with parameters]
- **Aspect Transformations**: [how aspects modify the pattern]

#### Test Results
- **Success**: [yes/no]
- **Errors**: [any error messages]
- **Notes**: [special observations]

---

## Testing Protocol

### 1. Individual Type Testing
For each tiling type (1-37):
1. Load the test environment
2. Set tiling type to X
3. Click "Test This Type"
4. Document all properties
5. Take screenshot of visual output
6. Record any errors or special behaviors

### 2. Parameter Testing
For each working tiling type:
1. Test with default parameters
2. Test with parameter variations (±0.1, ±0.2, etc.)
3. Document how parameters affect the pattern
4. Record parameter ranges that produce valid results

### 3. Visual Regression Testing
1. Capture screenshots of each tiling type
2. Record exact pixel positions of key features
3. Document color schemes and patterns
4. Note any animation or transition effects

## Data Collection

### JSON Test Results
The test environment automatically generates `tiling-test-results.json` with:
- Success/failure status
- All numerical properties
- Parameter values
- Translation vectors
- Timestamps

### Screenshots
- Save screenshots as `tiling-type-X.png`
- Include both test environment and demo views
- Document any variations with different parameters

## Refactoring Safety Checklist

Before making any changes:
- [ ] All 37 tiling types documented
- [ ] Screenshots captured for each type
- [ ] Parameter ranges tested and recorded
- [ ] JSON test results saved
- [ ] Original behavior fully understood

After each refactoring step:
- [ ] All tests pass
- [ ] Visual output matches original
- [ ] No new errors introduced
- [ ] Performance not degraded

## Notes
- Focus on preserving exact visual output
- Document any "magic numbers" or hardcoded values
- Note dependencies between different parts of the code
- Record any undocumented behaviors or edge cases
