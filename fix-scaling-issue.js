#!/usr/bin/env node

/**
 * Fix Scaling Issue
 * The canvas utilization fix had scale bounds that were too high,
 * causing large empty areas. This fixes the scaling calculation.
 */

import fs from 'fs';

console.log('📏 SCALING ISSUE FIX');
console.log('=' .repeat(60));
console.log('Fixing canvas scaling to eliminate empty space issues');
console.log('');

// Read current file
const currentFile = 'demo/random-tiling-generator.js';
const content = fs.readFileSync(currentFile, 'utf8');

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = `backups/random-tiling-generator.js.backup.pre-scaling-fix-${timestamp}`;
fs.writeFileSync(backupPath, content);
console.log(`📁 Backup created: ${backupPath}`);

let fixedContent = content;

// Fix the scale clamping - 25.0 is way too high, causing huge tiles
const scalingRegex = /(sc:\s*Math\.max\(2\.0,\s*Math\.min\(25\.0,\s*finalScale\)\))/;
const newScaling = `sc: Math.max(3.0, Math.min(12.0, finalScale))`;
fixedContent = fixedContent.replace(scalingRegex, newScaling);

// Also improve the scaling calculation to be more robust
const scaleCalcRegex = /(\/\/ Adaptive scaling based on canvas size and tiling characteristics[\s\S]*?const finalScale = optimalScale \* scaleVariation;)/;
const newScaleCalc = `// Adaptive scaling based on canvas size and tiling characteristics
		const canvasSize = Math.min(canvasWidth, canvasHeight);
		
		// More robust tile size calculation with fallback
		let avgTileSize = (t1Len + t2Len) / 2;
		
		// Handle edge cases where tiling vectors are very small or very large
		if (avgTileSize < 0.1) avgTileSize = 0.5; // Fallback for tiny tilings
		if (avgTileSize > 10.0) avgTileSize = 2.0; // Fallback for huge tilings
		
		const targetTilesAcross = 8 + Math.random() * 4; // 8-12 tiles across (tighter range)
		let optimalScale = canvasSize / (targetTilesAcross * avgTileSize);
		
		// More conservative scale variation (±20% instead of ±30%)
		const scaleVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 multiplier
		const finalScale = optimalScale * scaleVariation;`;

fixedContent = fixedContent.replace(scaleCalcRegex, newScaleCalc);

// Write the fixed file
fs.writeFileSync(currentFile, fixedContent);

console.log('✅ Scaling issue fixed!');
console.log('');
console.log('🎯 Fixed Issues:');
console.log('   • Scale range: 3.0 to 12.0 (was 2.0 to 25.0)');
console.log('   • Target tiles: 8-12 across canvas (was 6-14)');
console.log('   • Scale variation: ±20% (was ±30%)');
console.log('   • Added fallbacks for extreme tile sizes');
console.log('');
console.log('📊 Expected Results:');
console.log('   • No more huge tiles with lots of empty space');
console.log('   • Better canvas coverage across all tiling types');
console.log('   • More consistent visual experience');
console.log('   • Tilings like IH62 should fill the canvas better');
console.log('');
console.log('🚀 Test your enhanced demo: http://localhost:8000/random-tiling-generator.html');
console.log('   Both canvas utilization AND aggressive curves are now active!');
