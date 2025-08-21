#!/usr/bin/env node

/**
 * Enhanced Curve Aggressiveness System
 * Makes curves more aggressive by default and displays the aggressiveness level
 * in the tiling information for better user feedback
 */

import fs from 'fs';

console.log('🔥 ENHANCED CURVE AGGRESSIVENESS SYSTEM');
console.log('=' .repeat(60));
console.log('Making curves more aggressive and showing curve info');
console.log('');

// Read current file
const currentFile = 'demo/random-tiling-generator.js';
const content = fs.readFileSync(currentFile, 'utf8');

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = `backups/random-tiling-generator.js.backup.pre-aggressive-${timestamp}`;
fs.writeFileSync(backupPath, content);
console.log(`📁 Backup created: ${backupPath}`);

let fixedContent = content;

// Enhanced aggressive curve generation with tracking
const enhancedCurveCode = `
	// Enhanced dynamic curve generation with aggressiveness tracking
	function generateSafeCurve(shapeType, maxAttempts = 3) {
		// More aggressive curve levels with expanded ranges
		const aggressivenessLevels = [
			{ name: 'Conservative', yRange: 0.15, xRangeJ: 0.3 },  // Still conservative but slightly more
			{ name: 'Moderate', yRange: 0.3, xRangeJ: 0.45 },     // More moderate 
			{ name: 'Aggressive', yRange: 0.45, xRangeJ: 0.6 },   // Very aggressive
			{ name: 'Extreme', yRange: 0.6, xRangeJ: 0.7 }        // NEW: Even more aggressive!
		];
		
		// Start from the most aggressive level and work down
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			const levelIndex = Math.max(0, aggressivenessLevels.length - 1 - attempt);
			const level = aggressivenessLevels[levelIndex];
			let controlPoints = [];
			
			if (shapeType === EdgeShape.J) {
				controlPoints = [
					{ x: Math.random() * level.xRangeJ + 0.1, y: (Math.random() - 0.5) * level.yRange },
					{ x: Math.random() * level.xRangeJ + (1 - level.xRangeJ - 0.1), y: (Math.random() - 0.5) * level.yRange }
				];
			} else { // S or U curves
				controlPoints = [
					{ x: Math.random() * level.xRangeJ + 0.1, y: (Math.random() - 0.5) * level.yRange }
				];
				
				if (shapeType === EdgeShape.S) {
					controlPoints.push({ x: 1.0 - controlPoints[0].x, y: -controlPoints[0].y });
				} else if (shapeType === EdgeShape.U) {
					controlPoints.push({ x: 1.0 - controlPoints[0].x, y: controlPoints[0].y });
				}
			}
			
			// More lenient safety check to allow more aggressive curves
			if (isControlPointSafe(controlPoints, shapeType, level.name)) {
				return { controlPoints, aggressivenessLevel: level.name };
			}
		}
		
		// Fallback to conservative if all attempts failed
		const safeLevel = aggressivenessLevels[0];
		let controlPoints;
		if (shapeType === EdgeShape.J) {
			controlPoints = [
				{ x: Math.random() * safeLevel.xRangeJ + 0.1, y: (Math.random() - 0.5) * safeLevel.yRange },
				{ x: Math.random() * safeLevel.xRangeJ + (1 - safeLevel.xRangeJ - 0.1), y: (Math.random() - 0.5) * safeLevel.yRange }
			];
		} else {
			const cp1 = { x: Math.random() * safeLevel.xRangeJ + 0.1, y: (Math.random() - 0.5) * safeLevel.yRange };
			if (shapeType === EdgeShape.S) {
				controlPoints = [cp1, { x: 1.0 - cp1.x, y: -cp1.y }];
			} else {
				controlPoints = [cp1, { x: 1.0 - cp1.x, y: cp1.y }];
			}
		}
		return { controlPoints, aggressivenessLevel: safeLevel.name };
	}
	
	// More lenient safety check to allow aggressive curves
	function isControlPointSafe(controlPoints, shapeType, levelName) {
		// Adjust safety margin based on aggressiveness level
		const safetyMargins = {
			'Conservative': 0.25,
			'Moderate': 0.4,
			'Aggressive': 0.55,
			'Extreme': 0.7
		};
		const safetyMargin = safetyMargins[levelName] || 0.25;
		
		// Check Y-bounds for all control points with level-appropriate margin
		for (let cp of controlPoints) {
			if (Math.abs(cp.y) > safetyMargin) {
				return false;
			}
		}
		
		// For J curves, check X distribution (more lenient)
		if (shapeType === EdgeShape.J && controlPoints.length >= 2) {
			const xSpacing = Math.abs(controlPoints[1].x - controlPoints[0].x);
			if (xSpacing < 0.15) { // More lenient than before (was 0.2)
				return false;
			}
		}
		
		// More lenient bezier curve safety estimation
		return estimateBezierSafety(controlPoints, safetyMargin);
	}
	
	// Enhanced bezier curve safety estimation with adjustable bounds
	function estimateBezierSafety(controlPoints, safetyBound = 0.4) {
		// Sample a few points along the bezier curve to check bounds
		const sampleCount = 5;
		
		for (let i = 0; i <= sampleCount; i++) {
			const t = i / sampleCount;
			let y;
			
			if (controlPoints.length >= 2) {
				// Cubic bezier approximation: P0(0,0), P1(cp[0]), P2(cp[1]), P3(1,0)
				const y0 = 0, y1 = controlPoints[0].y, y2 = controlPoints[1].y || 0, y3 = 0;
				y = (1-t)*(1-t)*(1-t)*y0 + 3*(1-t)*(1-t)*t*y1 + 3*(1-t)*t*t*y2 + t*t*t*y3;
			} else {
				// Quadratic bezier approximation
				const y0 = 0, y1 = controlPoints[0].y, y2 = 0;
				y = (1-t)*(1-t)*y0 + 2*(1-t)*t*y1 + t*t*y2;
			}
			
			if (Math.abs(y) > safetyBound) {
				return false; // Curve extends too far outside tile
			}
		}
		
		return true; // Curve appears safe
	}`;

// Replace the existing curve generation functions
fixedContent = fixedContent.replace(
    /\/\/ Dynamic curve generation with overlap detection[\s\S]*?return estimateBezierSafety\(controlPoints\);\s*\n\s*\}/,
    enhancedCurveCode.trim()
);

// Update the curve generation call to track aggressiveness
const curveGenCallRegex = /(ej = generateSafeCurve\(shp\);)/;
const newCurveGenCall = `const curveResult = generateSafeCurve(shp);
				ej = curveResult.controlPoints;
				
				// Store aggressiveness info for display
				if (!edgeAggressiveness) edgeAggressiveness = [];
				edgeAggressiveness.push({
					edgeIndex: i,
					shapeType: shp,
					level: curveResult.aggressivenessLevel
				});`;

fixedContent = fixedContent.replace(curveGenCallRegex, newCurveGenCall);

// Add edgeAggressiveness tracking initialization
const edgeInitRegex = /(let edges = \[\];)/;
const newEdgeInit = `let edges = [];
		let edgeAggressiveness = [];`;
fixedContent = fixedContent.replace(edgeInitRegex, newEdgeInit);

// Store aggressiveness info in tilingData
const tilingDataRegex = /(parameters: ps\.slice\(\), \/\/ Copy the parameters array)/;
const newTilingDataLine = `parameters: ps.slice(), // Copy the parameters array
			edgeAggressiveness: edgeAggressiveness, // Store curve aggressiveness info`;
fixedContent = fixedContent.replace(tilingDataRegex, newTilingDataLine);

// Update the displayTilingInfo function to show curve aggressiveness
const displayInfoRegex = /(infoHTML \+= edgeShapes\.join\(', '\) \+ '<br\/>';)/;
const newDisplayInfo = `infoHTML += edgeShapes.join(', ') + '<br/>';
		
		// Display curve aggressiveness information
		if (tilingData.edgeAggressiveness && tilingData.edgeAggressiveness.length > 0) {
			infoHTML += '<strong>Curve Aggressiveness:</strong> ';
			const aggLevels = tilingData.edgeAggressiveness.map(agg => 
				\`Edge \${agg.edgeIndex}: \${agg.level}\`
			);
			infoHTML += aggLevels.join(', ') + '<br/>';
		}`;
fixedContent = fixedContent.replace(displayInfoRegex, newDisplayInfo);

// Write the enhanced file
fs.writeFileSync(currentFile, fixedContent);

console.log('✅ Enhanced curve aggressiveness implemented!');
console.log('');
console.log('🔥 New Aggressiveness Levels:');
console.log('   • EXTREME: Y range ±0.6, X range 0.7 (NEW!)');
console.log('   • AGGRESSIVE: Y range ±0.45, X range 0.6');  
console.log('   • MODERATE: Y range ±0.3, X range 0.45');
console.log('   • CONSERVATIVE: Y range ±0.15, X range 0.3');
console.log('');
console.log('🎯 Enhancements:');
console.log('   • Added new EXTREME aggressiveness level');
console.log('   • More lenient safety thresholds');
console.log('   • Curve aggressiveness displayed in tiling info');
console.log('   • Tracks which level was used for each edge');
console.log('   • Starts with most aggressive and works down');
console.log('');
console.log('📊 User Experience:');
console.log('   • See "Curve Aggressiveness: Edge 0: Extreme, Edge 1: Aggressive"');
console.log('   • Much more dramatic and interesting curves');
console.log('   • Better feedback on what the algorithm chose');
console.log('');
console.log('🚀 Test your enhanced demo: http://localhost:8000/random-tiling-generator.html');
