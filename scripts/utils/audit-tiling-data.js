#!/usr/bin/env node

/**
 * Comprehensive Tiling Data Audit
 * Compares all 81 tiling types between old (tactile.js) and new (TilingData.js) structures
 * to identify data corruption and inconsistencies
 */

import fs from 'fs';

// Read the old tactile.js file 
const oldData = fs.readFileSync('lib/tactile.js', 'utf8');

// Read the new TilingData.js file
const newData = fs.readFileSync('lib/data/TilingData.js', 'utf8');

// Function to extract tiling type data from old tactile.js
function parseOldTactileData() {
    const tilingTypes = [];
    
    // Extract the tiling_type_data array from the old file
    const regex = /\/\/ IH(\d+)\s*\n\s*{\s*\n([\s\S]*?)\s*\n\s*\}/g;
    let match;
    
    while ((match = regex.exec(oldData)) !== null) {
        const tilingNumber = parseInt(match[1]);
        const content = match[2];
        
        // Extract individual fields
        const numParams = content.match(/num_params:\s*(\d+)/)?.[1] || '0';
        const numAspects = content.match(/num_aspects:\s*(\d+)/)?.[1] || '0'; 
        const numVertices = content.match(/num_vertices:\s*(\d+)/)?.[1] || '0';
        const numEdgeShapes = content.match(/num_edge_shapes:\s*(\d+)/)?.[1] || '0';
        const edgeShapes = content.match(/edge_shapes:\s*(\w+)/)?.[1] || '';
        
        tilingTypes[tilingNumber] = {
            num_params: parseInt(numParams),
            num_aspects: parseInt(numAspects),
            num_vertices: parseInt(numVertices), 
            num_edge_shapes: parseInt(numEdgeShapes),
            edge_shapes: edgeShapes
        };
    }
    
    return tilingTypes;
}

// Function to extract tiling type data from new TilingData.js
function parseNewTilingData() {
    const tilingTypes = [];
    
    // Extract individual tiling entries
    const regex = /(\d+):\s*{\s*\n([\s\S]*?)\s*\n\s*\},/g;
    let match;
    
    while ((match = regex.exec(newData)) !== null) {
        const tilingNumber = parseInt(match[1]);
        const content = match[2];
        
        // Extract individual fields
        const numParams = content.match(/num_params:\s*(\d+)/)?.[1] || '0';
        const numAspects = content.match(/num_aspects:\s*(\d+)/)?.[1] || '0';
        const numVertices = content.match(/num_vertices:\s*(\d+)/)?.[1] || '0'; 
        const numEdgeShapes = content.match(/num_edge_shapes:\s*(\d+)/)?.[1] || '0';
        const edgeShapes = content.match(/edge_shapes:\s*(\w+)/)?.[1] || '';
        
        tilingTypes[tilingNumber] = {
            num_params: parseInt(numParams),
            num_aspects: parseInt(numAspects),
            num_vertices: parseInt(numVertices),
            num_edge_shapes: parseInt(numEdgeShapes),
            edge_shapes: edgeShapes
        };
    }
    
    return tilingTypes;
}

// Function to resolve edge shape arrays
function getEdgeShapeArray(edgeShapeId, dataSource) {
    const regex = new RegExp(`const ${edgeShapeId}\\s*=\\s*\\[([^\\]]+)\\]`);
    const match = dataSource.match(regex);
    if (match) {
        // Count the number of EdgeShape elements
        const elements = match[1].split(',').map(s => s.trim()).filter(s => s.includes('EdgeShape'));
        return elements.length;
    }
    return 0;
}

// Main audit function
function auditTilingTypes() {
    console.log('🔍 COMPREHENSIVE TILING DATA AUDIT');
    console.log('=' .repeat(60));
    console.log('Comparing old tactile.js vs new TilingData.js');
    console.log('');
    
    const oldTypes = parseOldTactileData();
    const newTypes = parseNewTilingData();
    
    const inconsistencies = [];
    
    // Check all tiling types 1-81
    for (let i = 1; i <= 81; i++) {
        if (!oldTypes[i] || !newTypes[i]) {
            console.log(`⚠️  IH${i}: Missing data in one of the sources`);
            continue;
        }
        
        const old = oldTypes[i];
        const new_ = newTypes[i];
        const issues = [];
        
        // Check parameter count
        if (old.num_params !== new_.num_params) {
            issues.push(`params: ${old.num_params} → ${new_.num_params}`);
        }
        
        // Check aspect count  
        if (old.num_aspects !== new_.num_aspects) {
            issues.push(`aspects: ${old.num_aspects} → ${new_.num_aspects}`);
        }
        
        // Check vertex count
        if (old.num_vertices !== new_.num_vertices) {
            issues.push(`vertices: ${old.num_vertices} → ${new_.num_vertices}`);
        }
        
        // Check edge shape count
        if (old.num_edge_shapes !== new_.num_edge_shapes) {
            issues.push(`edge_shapes: ${old.num_edge_shapes} → ${new_.num_edge_shapes}`);
        }
        
        // Check edge shape arrays if different
        if (old.edge_shapes !== new_.edge_shapes) {
            const oldCount = getEdgeShapeArray(old.edge_shapes, oldData);
            const newCount = getEdgeShapeArray(new_.edge_shapes, newData);
            if (oldCount !== newCount) {
                issues.push(`edge_array: ${old.edge_shapes}(${oldCount}) → ${new_.edge_shapes}(${newCount})`);
            }
        }
        
        if (issues.length > 0) {
            console.log(`🐛 IH${i}: ${issues.join(', ')}`);
            inconsistencies.push({
                type: i,
                issues: issues,
                old: old,
                new: new_
            });
        } else {
            console.log(`✅ IH${i}: OK`);
        }
    }
    
    console.log('');
    console.log('📊 AUDIT SUMMARY');
    console.log('=' .repeat(60));
    console.log(`Total types checked: 81`);
    console.log(`Inconsistent types: ${inconsistencies.length}`);
    console.log('');
    
    if (inconsistencies.length > 0) {
        console.log('🚨 CORRUPTED TILING TYPES:');
        inconsistencies.forEach(item => {
            console.log(`   IH${item.type}: ${item.issues.join(', ')}`);
        });
        
        // Save detailed report
        fs.writeFileSync('tiling-data-audit-report.json', JSON.stringify({
            timestamp: new Date().toISOString(),
            summary: {
                total_checked: 81,
                corrupted_count: inconsistencies.length,
                clean_count: 81 - inconsistencies.length
            },
            corrupted_types: inconsistencies
        }, null, 2));
        
        console.log('');
        console.log('💾 Detailed report saved to: tiling-data-audit-report.json');
    } else {
        console.log('🎉 All tiling types are consistent!');
    }
}

// Run the audit
try {
    auditTilingTypes();
} catch (error) {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
}
