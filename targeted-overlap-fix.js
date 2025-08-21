#!/usr/bin/env node

/**
 * Targeted Overlap Fix
 * Fixes the specific tiling types that cause overlapping issues
 * IH24, IH30, IH36, IH37 - the ones causing user-reported overlaps
 */

import fs from 'fs';

console.log('🎯 TARGETED OVERLAP FIX');
console.log('=' .repeat(60));
console.log('Fixing specific tiling types causing overlaps: IH24, IH30, IH36, IH37');
console.log('');

// Create backup first
const tactileJs = fs.readFileSync('lib/tactile.js', 'utf8');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = `backups/tactile.js.backup.targeted-${timestamp}`;
fs.writeFileSync(backupPath, tactileJs);
console.log(`📁 Backup created: ${backupPath}`);
console.log('');

let fixedContent = tactileJs;

// Fix IH24: params 4→3, edge_shapes 4→3 (es_19 → es_20)
console.log('🔧 Fixing IH24...');
fixedContent = fixedContent.replace(
    /(\/\/ IH24\s*\n\s*{\s*\n\s*num_params:\s*)4(,[\s\S]*?num_edge_shapes:\s*)4(,[\s\S]*?edge_shapes:\s*)es_19/,
    '$13$23$3es_20'
);

// Fix IH30: params 1→0, edge_shapes 3→2 (es_22 → es_23) 
console.log('🔧 Fixing IH30...');
fixedContent = fixedContent.replace(
    /(\/\/ IH30\s*\n\s*{\s*\n\s*num_params:\s*)1(,[\s\S]*?num_edge_shapes:\s*)3(,[\s\S]*?edge_shapes:\s*)es_22/,
    '$10$22$3es_23'
);

// Fix IH36: edge_shapes 1→2 (es_06 → es_10), aspects 3→6, vertices 4→3
console.log('🔧 Fixing IH36...');
fixedContent = fixedContent.replace(
    /(\/\/ IH36\s*\n\s*{\s*\n\s*num_params:\s*0,\s*\n\s*num_aspects:\s*)3(,\s*\n\s*num_vertices:\s*)4(,\s*\n\s*num_edge_shapes:\s*)1(,[\s\S]*?edge_shapes:\s*)es_06/,
    '$16$23$31$4es_10'
);

// Fix IH37: edge_shapes 1→2 (es_15 → es_25), aspects 3→6, vertices 4→3  
console.log('🔧 Fixing IH37...');
fixedContent = fixedContent.replace(
    /(\/\/ IH37\s*\n\s*{\s*\n\s*num_params:\s*0,\s*\n\s*num_aspects:\s*)3(,\s*\n\s*num_vertices:\s*)4(,\s*\n\s*num_edge_shapes:\s*)1(,[\s\S]*?edge_shapes:\s*)es_15/,
    '$16$23$31$4es_25'
);

// Check if changes were made
const changesMade = fixedContent !== tactileJs;

if (changesMade) {
    // Write the fixed file
    fs.writeFileSync('lib/tactile.js', fixedContent);
    
    console.log('');
    console.log('✅ SUCCESS! Targeted fixes applied');
    console.log('📊 Fixed tiling types:');
    console.log('   • IH24: Parameters 4→3, Edge shapes 4→3');  
    console.log('   • IH30: Parameters 1→0, Edge shapes 3→2');
    console.log('   • IH36: Edge shapes 1→2, Aspects 3→6, Vertices 4→3');
    console.log('   • IH37: Edge shapes 1→2, Aspects 3→6, Vertices 4→3');
    console.log('');
    console.log('🎉 Overlapping issues should be significantly reduced!');
    console.log('🚀 Test your demo at: http://localhost:8000/random-tiling-generator.html');
    
} else {
    console.log('❌ No changes were applied - patterns may not have matched');
    console.log('Original file preserved');
}
