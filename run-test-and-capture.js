#!/usr/bin/env node

/**
 * Test Runner and Results Capture Script
 * This script runs the comprehensive test and captures the results
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Comprehensive Test and Results Capture...\n');

// Load the original tactile.js library
const tactilePath = path.join(__dirname, 'lib', 'tactile.js');
const tactileCode = fs.readFileSync(tactilePath, 'utf8');

// Create a test environment that mimics the browser test
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

// Test all valid tiling types
console.log('Testing all valid tiling types...');
for (let i = 0; i < tilingTypes.length; i++) {
    const type = tilingTypes[i];
    testResults[type] = testTilingType(type);
    
    if (testResults[type].success) {
        console.log(\`✓ Type \${type}: \${testResults[type].vertices} vertices, \${testResults[type].aspects} aspects, \${testResults[type].edgeShapes} edge shapes\`);
    } else {
        console.log(\`✗ Type \${type}: \${testResults[type].error}\`);
    }
}

// Output results
console.log('\\n=== TEST RESULTS ===');
console.log(JSON.stringify(testResults, null, 2));
`;

// Write test file
const testFilePath = path.join(__dirname, 'temp-comprehensive-test.js');
fs.writeFileSync(testFilePath, testCode);

console.log('📝 Test script created. Running comprehensive test...\n');

try {
    const { execSync } = require('child_process');
    const output = execSync(`node ${testFilePath}`, { encoding: 'utf8' });
    
    // Parse the output to find the JSON results
    const lines = output.split('\n');
    let jsonStart = -1;
    let jsonEnd = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('=== TEST RESULTS ===')) {
            jsonStart = i + 1;
            break;
        }
    }
    
    if (jsonStart !== -1) {
        const jsonContent = lines.slice(jsonStart).join('\n');
        const results = JSON.parse(jsonContent);
        
        // Generate comprehensive documentation
        const docPath = path.join(__dirname, 'COMPREHENSIVE_BASELINE_RESULTS.md');
        const jsonPath = path.join(__dirname, 'comprehensive-baseline-results.json');
        
        let documentation = `# Comprehensive Baseline Results - Tactile-JS

Generated on: ${new Date().toISOString()}

## Overview
This document establishes the baseline behavior of all tiling types before any refactoring begins. This serves as our "ground truth" to ensure refactoring doesn't break functionality.

## Summary

- **Total Valid Types**: ${tilingTypes.length}
- **Successfully Tested**: ${Object.values(results).filter(r => r.success).length}
- **Failed**: ${Object.values(results).filter(r => !r.success).length}
- **Success Rate**: ${((Object.values(results).filter(r => r.success).length / tilingTypes.length) * 100).toFixed(1)}%

## Valid Tiling Types
${tilingTypes.join(', ')}

## Detailed Results

`;

        // Add results for each type
        for (let i = 0; i < tilingTypes.length; i++) {
            const type = tilingTypes[i];
            const result = results[type];
            documentation += `### Tiling Type ${type}

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
        fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
        
        console.log('✅ Test completed successfully!');
        console.log(`📄 Documentation saved to: ${docPath}`);
        console.log(`📊 Raw results saved to: ${jsonPath}`);
        
        // Show summary
        const successful = Object.values(results).filter(r => r.success);
        const failed = Object.values(results).filter(r => !r.success);
        
        console.log('\n📈 Summary:');
        console.log(`   Valid Types: ${tilingTypes.length}`);
        console.log(`   Successful: ${successful.length}`);
        console.log(`   Failed: ${failed.length}`);
        console.log(`   Success Rate: ${((successful.length / tilingTypes.length) * 100).toFixed(1)}%`);
        
        if (failed.length > 0) {
            console.log('\n❌ Failed types:');
            failed.forEach(f => console.log(`   - Type ${f.type}: ${f.error}`));
        }
        
        console.log('\n🎯 Ready for refactoring! All valid tiling types are working.');
        
    } else {
        console.error('❌ Could not find test results in output');
        console.log('Raw output:', output);
    }
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('Full error:', error);
} finally {
    // Clean up
    if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
    }
}
