#!/usr/bin/env node

/**
 * Test script for TilingDataLoader
 * 
 * Tests the updated TilingDataLoader with the extracted data structures.
 */

import { TilingDataLoader } from '../../lib/data/TilingDataLoader.js';

async function testTilingDataLoader() {
    console.log('=== Testing TilingDataLoader ===\n');

    const loader = new TilingDataLoader();

    try {
        // Test 1: Initialize the loader
        console.log('1. Initializing TilingDataLoader...');
        await loader.initialize();
        console.log('✅ Initialization successful\n');

        // Test 2: Get statistics
        console.log('2. Getting statistics...');
        const stats = loader.getStatistics();
        console.log('Statistics:', JSON.stringify(stats, null, 2));
        console.log('✅ Statistics retrieved successfully\n');

        // Test 3: Validate data integrity
        console.log('3. Validating data integrity...');
        const integrityIssues = loader.validateDataIntegrity();
        if (integrityIssues.length === 0) {
            console.log('✅ Data integrity validation passed - no issues found');
        } else {
            console.log('❌ Data integrity issues found:');
            integrityIssues.forEach(issue => console.log(`  - ${issue}`));
        }
        console.log();

        // Test 4: Get a specific tiling type
        console.log('4. Testing tiling type retrieval...');
        const testTypeId = 1;
        const tilingType = loader.getTilingType(testTypeId);
        if (tilingType) {
            console.log(`✅ Successfully retrieved tiling type ${testTypeId}:`);
            console.log(`   - Name: ${tilingType.name}`);
            console.log(`   - Parameters: ${tilingType.getParameterCount()}`);
            console.log(`   - Vertices: ${tilingType.getVertexCount()}`);
            console.log(`   - Aspects: ${tilingType.getAspectCount()}`);
            console.log(`   - Edge Shapes: ${tilingType.edgeShapes.length}`);
        } else {
            console.log(`❌ Failed to retrieve tiling type ${testTypeId}`);
        }
        console.log();

        // Test 5: Get all tiling types
        console.log('5. Testing retrieval of all tiling types...');
        const allTypes = loader.getAllTilingTypes();
        console.log(`✅ Retrieved ${allTypes.length} tiling types`);
        
        // Show a few examples
        console.log('Sample tiling types:');
        allTypes.slice(0, 3).forEach(type => {
            console.log(`   - ${type.name}: ${type.getParameterCount()} params, ${type.getVertexCount()} vertices`);
        });
        console.log();

        // Test 6: Test edge shape functionality
        console.log('6. Testing edge shape functionality...');
        const testType = loader.getTilingType(1);
        if (testType) {
            console.log(`Edge shapes for ${testType.name}:`);
            for (let i = 0; i < testType.edgeShapes.length; i++) {
                const shape = testType.getEdgeShape(i);
                const shapeId = testType.getEdgeShapeId(i);
                const orientation = testType.getEdgeOrientation(i);
                console.log(`   Edge ${i}: Shape=${shape}, ID=${shapeId}, Orientation=${orientation}`);
            }
        }
        console.log();

        // Test 7: Test parameter functionality
        console.log('7. Testing parameter functionality...');
        if (testType) {
            const defaultParams = testType.getDefaultParams();
            console.log(`Default parameters for ${testType.name}: [${defaultParams.join(', ')}]`);
        }
        console.log();

        // Test 8: Validate all tiling types
        console.log('8. Validating all tiling types...');
        let validCount = 0;
        let invalidCount = 0;
        
        for (const type of allTypes) {
            if (type.isValid()) {
                validCount++;
            } else {
                invalidCount++;
                console.log(`   ❌ Invalid tiling type: ${type.name}`);
            }
        }
        
        console.log(`✅ Validation complete: ${validCount} valid, ${invalidCount} invalid`);
        console.log();

        // Test 9: Test edge shape counting
        console.log('9. Testing edge shape analysis...');
        const edgeShapeCounts = {};
        for (const type of allTypes) {
            for (let i = 0; i < type.edgeShapes.length; i++) {
                const shape = type.getEdgeShape(i);
                edgeShapeCounts[shape] = (edgeShapeCounts[shape] || 0) + 1;
            }
        }
        console.log('Edge shape distribution:');
        Object.entries(edgeShapeCounts).forEach(([shape, count]) => {
            console.log(`   ${shape}: ${count} occurrences`);
        });
        console.log();

        console.log('=== All Tests Completed Successfully ===');
        return true;

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        console.error(error.stack);
        return false;
    }
}

// Run the test
testTilingDataLoader().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
});
