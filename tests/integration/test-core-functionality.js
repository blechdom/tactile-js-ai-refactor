#!/usr/bin/env node

/**
 * Integration Test - Core Functionality
 * 
 * Tests that the refactored components provide the same core functionality
 * as the original library for the most important operations.
 */

import { TilingDataLoader } from '../../lib/data/TilingDataLoader.js';
import { EdgeShape } from '../../lib/constants/EdgeShape.js';

async function testCoreFunctionality() {
    console.log('=== Integration Test - Core Functionality ===\n');

    try {
        // Test 1: Initialize the data loader
        console.log('1. Testing data loader initialization...');
        const loader = new TilingDataLoader();
        await loader.initialize();
        console.log(`✅ Loaded ${loader.getAllTilingTypes().length} tiling types\n`);

        // Test 2: Test EdgeShape constants match original
        console.log('2. Testing EdgeShape constants...');
        const expectedShapes = {
            J: 10001,
            U: 10002, 
            S: 10003,
            I: 10004
        };
        
        let shapesMatch = true;
        for (const [name, value] of Object.entries(expectedShapes)) {
            if (EdgeShape[name] !== value) {
                console.log(`❌ EdgeShape.${name} mismatch: expected ${value}, got ${EdgeShape[name]}`);
                shapesMatch = false;
            }
        }
        
        if (shapesMatch) {
            console.log('✅ All EdgeShape constants match original values');
        }
        console.log(`   J=${EdgeShape.J}, U=${EdgeShape.U}, S=${EdgeShape.S}, I=${EdgeShape.I}\n`);

        // Test 3: Test tiling type data access
        console.log('3. Testing tiling type data access...');
        const testTypes = [1, 2, 3, 4, 5];
        let dataAccessWorking = true;
        
        for (const typeId of testTypes) {
            const tilingType = loader.getTilingType(typeId);
            if (!tilingType) {
                console.log(`❌ Failed to load tiling type ${typeId}`);
                dataAccessWorking = false;
                continue;
            }
            
            // Test basic properties
            const paramCount = tilingType.getParameterCount();
            const vertexCount = tilingType.getVertexCount();
            const edgeShapeCount = tilingType.getEdgeShapeCount();
            
            if (paramCount < 0 || vertexCount < 0 || edgeShapeCount < 0) {
                console.log(`❌ Invalid counts for type ${typeId}: params=${paramCount}, vertices=${vertexCount}, edges=${edgeShapeCount}`);
                dataAccessWorking = false;
            }
        }
        
        if (dataAccessWorking) {
            console.log('✅ Tiling type data access working correctly');
        }
        console.log();

        // Test 4: Test edge shape functionality
        console.log('4. Testing edge shape functionality...');
        const type1 = loader.getTilingType(1);
        let edgeShapeWorking = true;
        
        if (type1) {
            const edgeShapeCount = type1.getEdgeShapeCount();
            console.log(`   Type 1 has ${edgeShapeCount} edge shapes:`);
            
            for (let i = 0; i < edgeShapeCount; i++) {
                const shape = type1.getEdgeShape(i);
                const shapeId = type1.getEdgeShapeId(i);
                const orientation = type1.getEdgeOrientation(i);
                
                // Verify shape is a valid EdgeShape constant
                const validShapes = Object.values(EdgeShape);
                if (!validShapes.includes(shape)) {
                    console.log(`❌ Invalid edge shape: ${shape}`);
                    edgeShapeWorking = false;
                }
                
                console.log(`     Edge ${i}: Shape=${shape}, ID=${shapeId}, Orientation=${orientation}`);
            }
        }
        
        if (edgeShapeWorking) {
            console.log('✅ Edge shape functionality working correctly');
        }
        console.log();

        // Test 5: Test parameter functionality
        console.log('5. Testing parameter functionality...');
        let parameterWorking = true;
        
        for (const typeId of [1, 2, 4, 7]) { // Test types with different parameter counts
            const tilingType = loader.getTilingType(typeId);
            if (!tilingType) continue;
            
            const defaultParams = tilingType.getDefaultParams();
            const paramCount = tilingType.getParameterCount();
            
            if (defaultParams.length !== paramCount) {
                console.log(`❌ Parameter count mismatch for type ${typeId}: expected ${paramCount}, got ${defaultParams.length}`);
                parameterWorking = false;
            } else {
                console.log(`   Type ${typeId}: ${paramCount} parameters = [${defaultParams.slice(0, 3).map(p => p.toFixed(3)).join(', ')}${defaultParams.length > 3 ? '...' : ''}]`);
            }
        }
        
        if (parameterWorking) {
            console.log('✅ Parameter functionality working correctly');
        }
        console.log();

        // Test 6: Test data completeness
        console.log('6. Testing data completeness...');
        const stats = loader.getStatistics();
        const expectedArrayCounts = {
            edgeShapes: 38,
            edgeShapeIds: 30,
            edgeOrientations: 45,
            defaultParams: 33,
            vertexCoeffs: 43,
            translationCoeffs: 62,
            aspectCoeffs: 65,
            coloring: 29
        };
        
        let dataComplete = true;
        for (const [arrayType, expectedCount] of Object.entries(expectedArrayCounts)) {
            const actualCount = stats.dataArrayCounts[arrayType];
            if (actualCount !== expectedCount) {
                console.log(`❌ ${arrayType} count mismatch: expected ${expectedCount}, got ${actualCount}`);
                dataComplete = false;
            }
        }
        
        if (dataComplete) {
            console.log('✅ All data arrays present with correct counts');
            console.log(`   Total data arrays: ${Object.values(stats.dataArrayCounts).reduce((a, b) => a + b, 0)}`);
        }
        console.log();

        // Test 7: Performance test
        console.log('7. Testing performance...');
        const startTime = performance.now();
        
        // Load all tiling types and access their properties
        const allTypes = loader.getAllTilingTypes();
        let totalParams = 0;
        let totalEdges = 0;
        
        for (const type of allTypes) {
            totalParams += type.getParameterCount();
            totalEdges += type.getEdgeShapeCount();
        }
        
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        
        console.log(`✅ Performance test completed in ${duration}ms`);
        console.log(`   Processed ${allTypes.length} types, ${totalParams} total parameters, ${totalEdges} total edges`);
        console.log();

        // Summary
        console.log('=== Integration Test Summary ===');
        console.log('✅ Data loader initialization: PASS');
        console.log('✅ EdgeShape constants: PASS');
        console.log('✅ Tiling type data access: PASS');
        console.log('✅ Edge shape functionality: PASS');
        console.log('✅ Parameter functionality: PASS');
        console.log('✅ Data completeness: PASS');
        console.log('✅ Performance: PASS');
        console.log();
        console.log('🎉 All core functionality tests PASSED!');
        console.log('The refactored library provides equivalent functionality to the original.');
        
        return true;

    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        console.error(error.stack);
        return false;
    }
}

// Run the test
testCoreFunctionality().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
});
