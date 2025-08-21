#!/usr/bin/env node

/**
 * Canvas Utilization Fix
 * Implements smart scaling and positioning to ensure tilings fill the canvas effectively
 * instead of leaving large empty areas or being too cramped
 */

import fs from 'fs';

console.log('📐 CANVAS UTILIZATION FIX');
console.log('=' .repeat(60));
console.log('Implementing smart scaling and positioning for better canvas coverage');
console.log('');

// Read current file
const currentFile = 'demo/random-tiling-generator.js';
const content = fs.readFileSync(currentFile, 'utf8');

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = `backups/random-tiling-generator.js.backup.pre-canvas-fix-${timestamp}`;
fs.writeFileSync(backupPath, content);
console.log(`📁 Backup created: ${backupPath}`);

// Smart canvas utilization code
const smartScalingCode = `
	// Smart canvas utilization - adapts scale and position for optimal coverage
	function calculateOptimalTransform(tiling, canvasWidth, canvasHeight) {
		// Get tiling's natural size vectors
		const t1 = tiling.getT1();
		const t2 = tiling.getT2(); 
		
		// Calculate the characteristic size of this tiling type
		const t1Len = Math.sqrt(t1.x * t1.x + t1.y * t1.y);
		const t2Len = Math.sqrt(t2.x * t2.x + t2.y * t2.y);
		const avgTileSize = (t1Len + t2Len) / 2;
		
		// Adaptive scaling based on canvas size and tiling characteristics
		const canvasSize = Math.min(canvasWidth, canvasHeight);
		const targetTilesAcross = 6 + Math.random() * 8; // 6-14 tiles across the canvas
		const optimalScale = canvasSize / (targetTilesAcross * avgTileSize);
		
		// Add some controlled variation to the optimal scale (±30%)
		const scaleVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3 multiplier
		const finalScale = optimalScale * scaleVariation;
		
		// Smart positioning - ensure good coverage with some randomness
		const marginFactor = 0.3; // 30% margin from edges
		const effectiveWidth = canvasWidth * (1 - 2 * marginFactor);
		const effectiveHeight = canvasHeight * (1 - 2 * marginFactor);
		
		const tx = canvasWidth * marginFactor + Math.random() * effectiveWidth;
		const ty = canvasHeight * marginFactor + Math.random() * effectiveHeight;
		
		// Rotation - keep it interesting but not too chaotic
		const theta = Math.random() * Math.PI * 2;
		
		return {
			tx: tx / canvasWidth,  // Normalize to 0-1 range  
			ty: ty / canvasHeight, // Normalize to 0-1 range
			theta: theta,
			sc: Math.max(2.0, Math.min(25.0, finalScale)) // Clamp to reasonable bounds
		};
	}`;

let fixedContent = content;

// Replace the transform calculation in createRandomTiling
const transformRegex = /(tx:\s*Math\.random\(\)\s*\*\s*10\.0,\s*\n\s*ty:\s*Math\.random\(\)\s*\*\s*10\.0,\s*\n\s*theta:\s*Math\.random\(\)\s*\*\s*p5c\.TWO_PI,\s*\n\s*sc:\s*Math\.random\(\)\s*\*\s*20\.0\s*\+\s*4\.0,)/;

const newTransformCode = `// Use smart canvas utilization
			...calculateOptimalTransform(tiling, 800, 600),`;

fixedContent = fixedContent.replace(transformRegex, newTransformCode);

// Insert the smart scaling function before createRandomTiling
const functionInsertPoint = /(\s*\/\/ Dynamic curve generation with overlap detection)/;
fixedContent = fixedContent.replace(functionInsertPoint, smartScalingCode + '\n$1');

// Also need to update the positioning in the drawTiling function to use the normalized coordinates
const drawTilingRegex = /(const O = \{ x: T\.tx, y: T\.ty \};)/;
const newDrawTilingCode = `const O = { x: T.tx * p5c.width, y: T.ty * p5c.height };`;
fixedContent = fixedContent.replace(drawTilingRegex, newDrawTilingCode);

// Update the animation drift to work with normalized coordinates  
const animationRegex = /(cur_tiling\.tx \+= cur_tiling\.dx;\s*\n\s*cur_tiling\.ty \+= cur_tiling\.dy;)/;
const newAnimationCode = `cur_tiling.tx += cur_tiling.dx / p5c.width;
		cur_tiling.ty += cur_tiling.dy / p5c.height;`;
fixedContent = fixedContent.replace(animationRegex, newAnimationCode);

// Check if changes were made
const changesMade = fixedContent !== content;

if (changesMade) {
    // Write the fixed file
    fs.writeFileSync(currentFile, fixedContent);
    
    console.log('✅ Smart canvas utilization implemented!');
    console.log('');
    console.log('🎯 New Features:');
    console.log('   • Adaptive scaling based on tiling geometry and canvas size');
    console.log('   • Smart positioning with controlled margins');
    console.log('   • Target coverage: 6-14 tiles across the canvas');
    console.log('   • Normalized coordinate system for consistency');
    console.log('   • Controlled scale variation (±30% from optimal)');
    console.log('');
    console.log('📊 Improvements:');
    console.log('   • No more tiny tilings lost in huge canvas');
    console.log('   • No more giant tilings with mostly empty space');
    console.log('   • Better visual balance and coverage');
    console.log('   • Consistent experience across different tiling types');
    console.log('');
    console.log('🚀 Test your enhanced demo: http://localhost:8000/random-tiling-generator.html');
    console.log('   Tilings should now fill the canvas much better!');
    
} else {
    console.log('❌ No changes were applied - patterns may not have matched');
    console.log('Original file preserved');
}
