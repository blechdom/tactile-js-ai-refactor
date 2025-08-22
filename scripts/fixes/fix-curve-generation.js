#!/usr/bin/env node

/**
 * Curve Generation Fix
 * Constrains the random curve generation to prevent extreme control points
 * that cause overlapping issues with curved edge shapes (J, S, U)
 */

import fs from 'fs';

console.log('🎨 CURVE GENERATION OVERLAP FIX');
console.log('=' .repeat(60));
console.log('Constraining curve control points to prevent overlapping');
console.log('');

// Read current file
const currentFile = 'demo/random-tiling-generator.js';
const content = fs.readFileSync(currentFile, 'utf8');

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = `backups/random-tiling-generator.js.backup.curves-${timestamp}`;
fs.writeFileSync(backupPath, content);
console.log(`📁 Backup created: ${backupPath}`);

// Apply curve constraint fixes
let fixedContent = content;

// Fix J (arbitrary curve) - constrain to safer ranges
console.log('🔧 Constraining J (arbitrary) curve generation...');
fixedContent = fixedContent.replace(
    /(\} else if\( shp == EdgeShape\.J \) \{\s*\n\s*ej\.push\(\s*\{ x:\s*)Math\.random\(\)\*0\.6(,\s*y\s*:\s*)Math\.random\(\)\s*-\s*0\.5(\s*\}\s*\);\s*\n\s*ej\.push\(\s*\{ x:\s*)Math\.random\(\)\*0\.6\s*\+\s*0\.4(,\s*y\s*:\s*)Math\.random\(\)\s*-\s*0\.5/g,
    '$1Math.random()*0.4 + 0.1$2(Math.random() - 0.5) * 0.2$3Math.random()*0.4 + 0.5$4(Math.random() - 0.5) * 0.2'
);

// Fix S (symmetric curve) - constrain to safer ranges  
console.log('🔧 Constraining S (symmetric) curve generation...');
fixedContent = fixedContent.replace(
    /(\} else if\( shp == EdgeShape\.S \) \{\s*\n\s*ej\.push\(\s*\{ x:\s*)Math\.random\(\)\*0\.6(,\s*y\s*:\s*)Math\.random\(\)\s*-\s*0\.5/g,
    '$1Math.random()*0.4 + 0.1$2(Math.random() - 0.5) * 0.2'
);

// Fix U (mirrored curve) - constrain to safer ranges
console.log('🔧 Constraining U (mirrored) curve generation...');  
fixedContent = fixedContent.replace(
    /(\} else if\( shp == EdgeShape\.U \) \{\s*\n\s*ej\.push\(\s*\{ x:\s*)Math\.random\(\)\*0\.6(,\s*y\s*:\s*)Math\.random\(\)\s*-\s*0\.5/g,
    '$1Math.random()*0.4 + 0.1$2(Math.random() - 0.5) * 0.2'
);

// Check if changes were made
const changesMade = fixedContent !== content;

if (changesMade) {
    // Write the fixed file
    fs.writeFileSync(currentFile, fixedContent);
    
    console.log('');
    console.log('✅ SUCCESS! Curve constraints applied');
    console.log('📊 Constraint Changes:');
    console.log('   • J curves: X range 0.1-0.5 and 0.5-0.9, Y range ±0.1 (was ±0.5)'); 
    console.log('   • S curves: X range 0.1-0.5, Y range ±0.1 (was ±0.5)');
    console.log('   • U curves: X range 0.1-0.5, Y range ±0.1 (was ±0.5)');
    console.log('');
    console.log('🎯 Benefits:');
    console.log('   • Curves stay within reasonable tile boundaries');
    console.log('   • Reduced extreme bulging and self-intersection');
    console.log('   • Significantly less overlapping with neighboring tiles');
    console.log('');
    console.log('🎉 Curve-based overlapping should be dramatically reduced!');
    console.log('🚀 Test your demo at: http://localhost:8000/random-tiling-generator.html');
    
} else {
    console.log('❌ No changes were applied - patterns may not have matched');
    console.log('Original file preserved');
}

console.log('');
console.log('💡 Key Insight: Overlaps occurred specifically with curves because');
console.log('   extreme random control points created curves that extended');
console.log('   beyond tile boundaries into neighboring tile space!');
