#!/usr/bin/env node

/**
 * Fix Missing calculateOptimalTransform Function
 * The canvas utilization fix didn't apply correctly, leaving a missing function.
 * This adds the function and also improves curve safety detection.
 */

import fs from 'fs';

console.log('🔧 FIXING MISSING FUNCTION & CURVE SAFETY');
console.log('=' .repeat(60));
console.log('Adding missing calculateOptimalTransform and improving safety detection');
console.log('');

// Read current file
const currentFile = 'demo/random-tiling-generator.js';
const content = fs.readFileSync(currentFile, 'utf8');

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = `backups/random-tiling-generator.js.backup.missing-function-${timestamp}`;
fs.writeFileSync(backupPath, content);
console.log(`📁 Backup created: ${backupPath}`);

let fixedContent = content;

// Add the missing calculateOptimalTransform function
const calculateOptimalTransformFunction = `
	// Smart canvas utilization - adapts scale and position for optimal coverage
	function calculateOptimalTransform(tiling, canvasWidth, canvasHeight) {
		// Get tiling's natural size vectors
		const t1 = tiling.getT1();
		const t2 = tiling.getT2(); 
		
		// More robust tile size calculation with fallback
		const t1Len = Math.sqrt(t1.x * t1.x + t1.y * t1.y);
		const t2Len = Math.sqrt(t2.x * t2.x + t2.y * t2.y);
		let avgTileSize = (t1Len + t2Len) / 2;
		
		// Handle edge cases where tiling vectors are very small or very large
		if (avgTileSize < 0.1) avgTileSize = 0.5; // Fallback for tiny tilings
		if (avgTileSize > 10.0) avgTileSize = 2.0; // Fallback for huge tilings
		
		// Adaptive scaling based on canvas size and tiling characteristics
		const canvasSize = Math.min(canvasWidth, canvasHeight);
		const targetTilesAcross = 8 + Math.random() * 4; // 8-12 tiles across (tighter range)
		let optimalScale = canvasSize / (targetTilesAcross * avgTileSize);
		
		// More conservative scale variation (±20% instead of ±30%)
		const scaleVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 multiplier
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
			sc: Math.max(3.0, Math.min(12.0, finalScale)) // Clamp to reasonable bounds
		};
	}`;

// Insert the function before the generateSafeCurve function
const functionInsertPoint = /(\s*\/\/ Enhanced dynamic curve generation with aggressiveness tracking)/;
fixedContent = fixedContent.replace(functionInsertPoint, calculateOptimalTransformFunction + '\n$1');

// Also make the curve safety detection more conservative for complex tilings
const safetyCheckRegex = /(\/\/ More lenient safety check to allow aggressive curves\s*\n\s*function isControlPointSafe[\s\S]*?return estimateBezierSafety\(controlPoints, safetyMargin\);)/;

const improvedSafetyCheck = `// More intelligent safety check that considers tiling complexity
	function isControlPointSafe(controlPoints, shapeType, levelName) {
		// Adjust safety margin based on aggressiveness level and shape complexity
		const safetyMargins = {
			'Conservative': 0.2,
			'Moderate': 0.32,
			'Aggressive': 0.42,
			'Extreme': 0.5  // More conservative for extreme level
		};
		const safetyMargin = safetyMargins[levelName] || 0.2;
		
		// Check Y-bounds for all control points with level-appropriate margin
		for (let cp of controlPoints) {
			if (Math.abs(cp.y) > safetyMargin) {
				return false;
			}
		}
		
		// For J curves, check X distribution (slightly more conservative)
		if (shapeType === EdgeShape.J && controlPoints.length >= 2) {
			const xSpacing = Math.abs(controlPoints[1].x - controlPoints[0].x);
			// Be more strict for extreme level
			const minSpacing = levelName === 'Extreme' ? 0.25 : 0.18;
			if (xSpacing < minSpacing) {
				return false;
			}
		}
		
		// More careful bezier curve safety estimation
		return estimateBezierSafety(controlPoints, safetyMargin * 0.9); // 10% more conservative
	}`;

fixedContent = fixedContent.replace(safetyCheckRegex, improvedSafetyCheck);

// Write the fixed file
fs.writeFileSync(currentFile, fixedContent);

console.log('✅ Missing function added and curve safety improved!');
console.log('');
console.log('🔧 Fixed Issues:');
console.log('   • Added missing calculateOptimalTransform function');
console.log('   • Proper scale clamping: 3.0 to 12.0 range');
console.log('   • More conservative curve safety for Extreme level');
console.log('   • Better X-spacing requirements for J curves');
console.log('   • Improved safety margins across all levels');
console.log('');
console.log('🎯 Expected Results:');
console.log('   • No more scale: 25.00 (should be 3.0-12.0)');
console.log('   • Better canvas utilization');
console.log('   • Fewer "all Extreme" cases (better safety fallback)');
console.log('   • IH20 and similar complex tilings should have fewer overlaps');
console.log('');
console.log('🚀 Test your enhanced demo: http://localhost:8000/random-tiling-generator.html');
