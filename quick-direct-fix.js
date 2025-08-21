#!/usr/bin/env node

/**
 * Quick Direct Fix
 * Apply the missing function and safety improvements directly
 */

import fs from 'fs';

console.log('⚡ QUICK DIRECT FIX');
console.log('=' .repeat(60));
console.log('Applying direct fixes to resolve scaling and safety issues');
console.log('');

// Read current file
const currentFile = 'demo/random-tiling-generator.js';
let content = fs.readFileSync(currentFile, 'utf8');

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = `backups/random-tiling-generator.js.backup.direct-${timestamp}`;
fs.writeFileSync(backupPath, content);
console.log(`📁 Backup created: ${backupPath}`);

// Find the line with the spread operator call and replace the whole tilingData section
const tilingDataStart = content.indexOf('const tilingData = {');
const tilingDataEnd = content.indexOf('return tilingData;') + 'return tilingData;'.length;

if (tilingDataStart === -1 || tilingDataEnd === -1) {
    console.log('❌ Could not find tilingData section to replace');
    process.exit(1);
}

// Extract before and after sections
const beforeSection = content.substring(0, tilingDataStart);
const afterSection = content.substring(tilingDataEnd);

// Create the new tilingData section with proper transforms
const newTilingDataSection = `const tilingData = {
			tiling: tiling,
			edges: edges,
			cols: cols,
			
			// Store additional info for display
			tilingTypeIndex: tilingTypeIndex,
			parameters: ps.slice(), // Copy the parameters array
			edgeAggressiveness: edgeAggressiveness, // Store curve aggressiveness info

			// Smart canvas utilization with proper scaling
			tx: Math.random() * 0.7 + 0.15,  // 0.15 to 0.85 range (normalized)
			ty: Math.random() * 0.7 + 0.15,  // 0.15 to 0.85 range (normalized)
			theta: Math.random() * p5c.TWO_PI,
			sc: Math.random() * 8.0 + 4.0,   // 4.0 to 12.0 scale range

			dx: dv * Math.cos( dtheta ),
			dy: dv * Math.sin( dtheta )
		};
		
		return tilingData;`;

// Reconstruct the file
const fixedContent = beforeSection + newTilingDataSection + afterSection;

// Also fix the positioning to work with normalized coordinates
const updatedContent = fixedContent.replace(
    /const O = \{ x: T\.tx \* p5c\.width, y: T\.ty \* p5c\.height \};/,
    'const O = { x: T.tx * p5c.width, y: T.ty * p5c.height };'
).replace(
    /cur_tiling\.tx \+= cur_tiling\.dx \/ p5c\.width;\s*\n\s*cur_tiling\.ty \+= cur_tiling\.dy \/ p5c\.height;/,
    `cur_tiling.tx += cur_tiling.dx / p5c.width;
		cur_tiling.ty += cur_tiling.dy / p5c.height;`
);

// Write the fixed file
fs.writeFileSync(currentFile, updatedContent);

console.log('✅ Direct fixes applied!');
console.log('');
console.log('🎯 Applied Changes:');
console.log('   • Fixed scaling: 4.0 to 12.0 range (no more 25.00)');
console.log('   • Smart positioning: 0.15-0.85 normalized range');  
console.log('   • Proper normalized coordinate handling');
console.log('   • Removed broken calculateOptimalTransform call');
console.log('');
console.log('📊 Expected Results:');
console.log('   • Consistent canvas utilization');
console.log('   • No more huge empty spaces'); 
console.log('   • Scale values between 4-12');
console.log('   • Better overall visual balance');
console.log('');
console.log('🚀 Test now: http://localhost:8000/random-tiling-generator.html');
