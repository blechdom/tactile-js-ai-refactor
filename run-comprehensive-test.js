#!/usr/bin/env node

/**
 * Comprehensive Test Script for Tactile-JS
 * This script tests all tiling types and generates documentation
 */

const fs = require('fs');
const path = require('path');

// Load the original tactile.js library
const tactilePath = path.join(__dirname, 'lib', 'tactile.js');
const tactileCode = fs.readFileSync(tactilePath, 'utf8');

// Create a test environment
const testCode = `
${tactileCode}

// Test environment
const testResults = {};

function testTilingType(type) {
    try {
        const tiling = new IsohedralTiling(type);
        
        const result = {
            success: true,
            type: type,
            vertices: tiling.numVertices(),
            aspects: tiling.numAspects(),
            edgeShapes: tiling.numEdgeShapes(),
            parameters: tiling.getParameters(),
            t1: tiling.getT1(),
            t2: tiling.getT2(),
            timestamp: new Date().toISOString()
        };
        
        // Test vertex generation
        const vertices = [];
        for (let i = 0; i < tiling.numVertices(); i++) {
            const vertex = tiling.getVertex(i);
            vertices.push({ x: vertex.x, y: vertex.y });
        }
        result.vertexPositions = vertices;
        
        // Test edge shapes
        const edgeShapes = [];
        for (let i = 0; i < tiling.numEdgeShapes(); i++) {
            edgeShapes.push(tiling.getEdgeShape(i));
        }
        result.edgeShapeTypes = edgeShapes;
        
        return result;
        
    } catch (error) {
        return {
            success: false,
            type: type,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Test all tiling types
for (let i = 1; i <= 37; i++) {
    testResults[i] = testTilingType(i);
}

// Output results
console.log(JSON.stringify(testResults, null, 2));
`;

// Write test file
const testFilePath = path.join(__dirname, 'temp-test.js');
fs.writeFileSync(testFilePath, testCode);

console.log('Running comprehensive test of all tiling types...');
console.log('This will test types 1-37 and generate documentation...');

// Run the test
try {
    const { execSync } = require('child_process');
    const output = execSync(`node ${testFilePath}`, { encoding: 'utf8' });
    
    // Parse results
    const results = JSON.parse(output);
    
    // Generate documentation
    const docPath = path.join(__dirname, 'COMPREHENSIVE_TEST_RESULTS.md');
    let documentation = `# Comprehensive Test Results - Tactile-JS

Generated on: ${new Date().toISOString()}

## Summary

- **Total Types Tested**: 37
- **Successful**: ${Object.values(results).filter(r => r.success).length}
- **Failed**: ${Object.values(results).filter(r => !r.success).length}

## Detailed Results

`;

    // Add results for each type
    for (let i = 1; i <= 37; i++) {
        const result = results[i];
        documentation += `### Tiling Type ${i}

- **Success**: ${result.success ? 'Yes' : 'No'}
${result.success ? `
- **Vertices**: ${result.vertices}
- **Aspects**: ${result.aspects}
- **Edge Shapes**: ${result.edgeShapes}
- **Parameters**: [${result.parameters.join(', ')}]
- **T1**: (${result.t1.x.toFixed(3)}, ${result.t1.y.toFixed(3)})
- **T2**: (${result.t2.x.toFixed(3)}, ${result.t2.y.toFixed(3)})
- **Edge Shape Types**: [${result.edgeShapeTypes.join(', ')}]
- **Vertex Positions**: ${JSON.stringify(result.vertexPositions, null, 2)}
` : `
- **Error**: ${result.error}
`}

---
`;
    }
    
    // Save documentation
    fs.writeFileSync(docPath, documentation);
    
    // Save raw JSON results
    const jsonPath = path.join(__dirname, 'comprehensive-test-results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    
    console.log('✅ Test completed successfully!');
    console.log(`📄 Documentation saved to: ${docPath}`);
    console.log(`📊 Raw results saved to: ${jsonPath}`);
    
    // Show summary
    const successful = Object.values(results).filter(r => r.success);
    const failed = Object.values(results).filter(r => !r.success);
    
    console.log('\n📈 Summary:');
    console.log(`   Successful: ${successful.length}/37`);
    console.log(`   Failed: ${failed.length}/37`);
    
    if (failed.length > 0) {
        console.log('\n❌ Failed types:');
        failed.forEach(f => console.log(`   - Type ${f.type}: ${f.error}`));
    }
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
} finally {
    // Clean up
    if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
    }
}
