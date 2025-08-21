#!/usr/bin/env node

/**
 * Create Data Snapshot Script
 * Creates a comprehensive snapshot of the current data structure for regression testing
 */

const fs = require('fs');
const path = require('path');

console.log('📊 Creating comprehensive data structure snapshot...\n');

// Load the original tactile.js library
const tactilePath = path.join(__dirname, 'lib', 'tactile.js');
const tactileCode = fs.readFileSync(tactilePath, 'utf8');

// Create a test environment that captures all data
const snapshotCode = `
${tactileCode}

// Data snapshot capture
const dataSnapshot = {};

function captureTilingTypeData(typeId) {
    try {
        const tiling = new IsohedralTiling(typeId);
        
        const snapshot = {
            typeId: typeId,
            timestamp: new Date().toISOString(),
            
            // Core properties
            numParams: tiling.numParameters(),
            numAspects: tiling.numAspects(),
            numVertices: tiling.numVertices(),
            numEdgeShapes: tiling.numEdgeShapes(),
            
            // Parameters
            defaultParams: tiling.getParameters(),
            
            // Translation vectors
            t1: tiling.getT1(),
            t2: tiling.getT2(),
            
            // Edge information
            edgeShapes: [],
            edgeShapeIds: [],
            edgeOrientations: []
        };
        
        // Capture edge shapes
        for (let i = 0; i < tiling.numEdgeShapes(); i++) {
            snapshot.edgeShapes.push(tiling.getEdgeShape(i));
        }
        
        // Try to access internal data if possible
        if (tiling.ttd) {
            snapshot.internalData = {
                edge_shape_ids: tiling.ttd.edge_shape_ids || [],
                edge_orientations: tiling.ttd.edge_orientations || [],
                vertex_coeffs: tiling.ttd.vertex_coeffs || [],
                translation_coeffs: tiling.ttd.translation_coeffs || [],
                aspect_coeffs: tiling.ttd.aspect_coeffs || [],
                coloring: tiling.ttd.coloring || []
            };
        }
        
        return snapshot;
        
    } catch (error) {
        return {
            typeId: typeId,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Capture data for all valid tiling types
console.log('Capturing data for all tiling types...');
for (let i = 0; i < tilingTypes.length; i++) {
    const typeId = tilingTypes[i];
    dataSnapshot[typeId] = captureTilingTypeData(typeId);
    
    if (dataSnapshot[typeId].error) {
        console.log(\`❌ Type \${typeId}: \${dataSnapshot[typeId].error}\`);
    } else {
        console.log(\`✅ Type \${typeId}: \${dataSnapshot[typeId].numParams} params, \${dataSnapshot[typeId].numVertices} vertices\`);
    }
}

// Output the complete snapshot
console.log('\\n=== COMPLETE DATA SNAPSHOT ===');
console.log(JSON.stringify(dataSnapshot, null, 2));
`;

// Write snapshot file
const snapshotFilePath = path.join(__dirname, 'temp-snapshot.js');
fs.writeFileSync(snapshotFilePath, snapshotCode);

console.log('📝 Snapshot script created. Running data capture...\n');

try {
    const { execSync } = require('child_process');
    const output = execSync(`node ${snapshotFilePath}`, { encoding: 'utf8' });
    
    // Parse the output to find the JSON snapshot
    const lines = output.split('\n');
    let jsonStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('=== COMPLETE DATA SNAPSHOT ===')) {
            jsonStart = i + 1;
            break;
        }
    }
    
    if (jsonStart !== -1) {
        const jsonContent = lines.slice(jsonStart).join('\n');
        const snapshot = JSON.parse(jsonContent);
        
        // Save the snapshot
        const snapshotPath = path.join(__dirname, 'data-structure-snapshot.json');
        fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
        
        // Generate summary
        const successful = Object.values(snapshot).filter(s => !s.error);
        const failed = Object.values(snapshot).filter(s => s.error);
        
        console.log('✅ Data snapshot created successfully!');
        console.log(`📄 Snapshot saved to: ${snapshotPath}`);
        console.log(`📊 Summary:`);
        console.log(`   Total Types: ${Object.keys(snapshot).length}`);
        console.log(`   Successful: ${successful.length}`);
        console.log(`   Failed: ${failed.length}`);
        
        if (failed.length > 0) {
            console.log('\n❌ Failed types:');
            failed.forEach(f => console.log(`   - Type ${f.typeId}: ${f.error}`));
        }
        
        // Create a validation test file
        const validationTestPath = path.join(__dirname, 'validate-snapshot.js');
        const validationCode = createValidationCode(snapshot);
        fs.writeFileSync(validationTestPath, validationCode);
        
        console.log(`🧪 Validation test created: ${validationTestPath}`);
        console.log('\n🎯 This snapshot can now be used to validate data structure integrity during refactoring!');
        
    } else {
        console.error('❌ Could not find snapshot data in output');
        console.log('Raw output:', output);
    }
    
} catch (error) {
    console.error('❌ Snapshot creation failed:', error.message);
} finally {
    // Clean up
    if (fs.existsSync(snapshotFilePath)) {
        fs.unlinkSync(snapshotFilePath);
    }
}

function createValidationCode(snapshot) {
    return `#!/usr/bin/env node

/**
 * Data Snapshot Validation Script
 * Validates that the current data structure matches the saved snapshot
 */

const fs = require('fs');
const path = require('path');

// Load the snapshot
const snapshotPath = path.join(__dirname, 'data-structure-snapshot.json');
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));

// Load the current library
const tactilePath = path.join(__dirname, 'lib', 'tactile.js');
const tactileCode = fs.readFileSync(tactilePath, 'utf8');

// Create validation environment
const validationCode = \`
\${tactileCode}

// Validation logic
let validationErrors = 0;
let validationWarnings = 0;

function validateTilingType(typeId, expectedData) {
    try {
        const tiling = new IsohedralTiling(typeId);
        
        // Validate core properties
        if (tiling.numParameters() !== expectedData.numParams) {
            console.log(\`❌ Type \${typeId}: Parameter count mismatch - Expected: \${expectedData.numParams}, Got: \${tiling.numParameters()}\`);
            validationErrors++;
        }
        
        if (tiling.numAspects() !== expectedData.numAspects) {
            console.log(\`❌ Type \${typeId}: Aspect count mismatch - Expected: \${expectedData.numAspects}, Got: \${tiling.numAspects()}\`);
            validationErrors++;
        }
        
        if (tiling.numVertices() !== expectedData.numVertices) {
            console.log(\`❌ Type \${typeId}: Vertex count mismatch - Expected: \${expectedData.numVertices}, Got: \${tiling.numVertices()}\`);
            validationErrors++;
        }
        
        if (tiling.numEdgeShapes() !== expectedData.numEdgeShapes) {
            console.log(\`❌ Type \${typeId}: Edge shape count mismatch - Expected: \${expectedData.numEdgeShapes}, Got: \${tiling.numEdgeShapes()}\`);
            validationErrors++;
        }
        
        // Validate parameters
        const currentParams = tiling.getParameters();
        if (currentParams.length !== expectedData.defaultParams.length) {
            console.log(\`❌ Type \${typeId}: Parameter array length mismatch\`);
            validationErrors++;
        } else {
            for (let i = 0; i < currentParams.length; i++) {
                if (Math.abs(currentParams[i] - expectedData.defaultParams[i]) > 1e-10) {
                    console.log(\`❌ Type \${typeId}: Parameter \${i} value changed - Expected: \${expectedData.defaultParams[i]}, Got: \${currentParams[i]}\`);
                    validationErrors++;
                }
            }
        }
        
        // Validate translation vectors
        const currentT1 = tiling.getT1();
        const currentT2 = tiling.getT2();
        
        if (Math.abs(currentT1.x - expectedData.t1.x) > 1e-10 || Math.abs(currentT1.y - expectedData.t1.y) > 1e-10) {
            console.log(\`❌ Type \${typeId}: T1 translation changed\`);
            validationErrors++;
        }
        
        if (Math.abs(currentT2.x - expectedData.t2.x) > 1e-10 || Math.abs(currentT2.y - expectedData.t2.y) > 1e-10) {
            console.log(\`❌ Type \${typeId}: T2 translation changed\`);
            validationErrors++;
        }
        
        console.log(\`✅ Type \${typeId}: Validation passed\`);
        
    } catch (error) {
        console.log(\`❌ Type \${typeId}: Validation failed - \${error.message}\`);
        validationErrors++;
    }
}

// Run validation
console.log('🧪 Validating data structure against snapshot...\\n');

Object.entries(snapshot).forEach(([typeId, expectedData]) => {
    if (!expectedData.error) {
        validateTilingType(parseInt(typeId), expectedData);
    }
});

console.log('\\n=== VALIDATION SUMMARY ===');
console.log(\`Total Types: \${Object.keys(snapshot).length}\`);
console.log(\`Validation Errors: \${validationErrors}\`);
console.log(\`Validation Warnings: \${validationWarnings}\`);

if (validationErrors === 0) {
    console.log('🎉 All validations passed! Data structure is intact.');
} else {
    console.log('⚠️ Found validation errors. Data structure may have changed.');
}
\`;

// Write validation file
const validationFilePath = path.join(__dirname, 'temp-validation.js');
fs.writeFileSync(validationFilePath, validationCode);

try {
    const { execSync } = require('child_process');
    const validationOutput = execSync(\`node \${validationFilePath}\`, { encoding: 'utf8' });
    console.log(validationOutput);
} catch (error) {
    console.error('Validation failed:', error.message);
} finally {
    if (fs.existsSync(validationFilePath)) {
        fs.unlinkSync(validationFilePath);
    }
}
`;
}
