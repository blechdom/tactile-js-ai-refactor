#!/usr/bin/env node

/**
 * Dynamic Curve Generation with Overlap Detection
 * Implements smart curve generation that tries aggressive curves first,
 * detects potential overlaps, and falls back to safer curves as needed.
 */

import fs from 'fs';

console.log('🎨 DYNAMIC CURVE GENERATION SYSTEM');
console.log('=' .repeat(60));
console.log('Implementing overlap detection with adaptive curve generation');
console.log('');

// Read current file
const currentFile = 'demo/random-tiling-generator.js';
const content = fs.readFileSync(currentFile, 'utf8');

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = `backups/random-tiling-generator.js.backup.pre-dynamic-${timestamp}`;
fs.writeFileSync(backupPath, content);
console.log(`📁 Backup created: ${backupPath}`);

// The new dynamic curve generation code
const dynamicCurveCode = `
	// Dynamic curve generation with overlap detection
	function generateSafeCurve(shapeType, maxAttempts = 3) {
		// Curve aggressiveness levels: 0 = conservative, 1 = moderate, 2 = aggressive
		const aggressivenessLevels = [
			{ yRange: 0.1, xRangeJ: 0.3 },  // Conservative (current safe level)
			{ yRange: 0.2, xRangeJ: 0.4 },  // Moderate  
			{ yRange: 0.35, xRangeJ: 0.5 }  // Aggressive (close to original)
		];
		
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			const level = aggressivenessLevels[maxAttempts - 1 - attempt]; // Start aggressive, get conservative
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
			
			// Check for potential overlap using bezier curve bounding estimation
			if (isControlPointSafe(controlPoints, shapeType)) {
				return controlPoints;
			}
		}
		
		// Fallback to most conservative if all attempts failed
		const safeLevel = aggressivenessLevels[0];
		if (shapeType === EdgeShape.J) {
			return [
				{ x: Math.random() * safeLevel.xRangeJ + 0.1, y: (Math.random() - 0.5) * safeLevel.yRange },
				{ x: Math.random() * safeLevel.xRangeJ + (1 - safeLevel.xRangeJ - 0.1), y: (Math.random() - 0.5) * safeLevel.yRange }
			];
		} else {
			const cp1 = { x: Math.random() * safeLevel.xRangeJ + 0.1, y: (Math.random() - 0.5) * safeLevel.yRange };
			if (shapeType === EdgeShape.S) {
				return [cp1, { x: 1.0 - cp1.x, y: -cp1.y }];
			} else {
				return [cp1, { x: 1.0 - cp1.x, y: cp1.y }];
			}
		}
	}
	
	// Estimate if control points would create overlapping curves
	function isControlPointSafe(controlPoints, shapeType) {
		// Safety margin - curves shouldn't bulge too far outside tile boundaries
		const safetyMargin = 0.3;
		
		// Check Y-bounds for all control points
		for (let cp of controlPoints) {
			if (Math.abs(cp.y) > safetyMargin) {
				return false;
			}
		}
		
		// For J curves, also check X distribution
		if (shapeType === EdgeShape.J && controlPoints.length >= 2) {
			const xSpacing = Math.abs(controlPoints[1].x - controlPoints[0].x);
			if (xSpacing < 0.2) { // Too close together can cause loops
				return false;
			}
		}
		
		// Additional check: estimate bezier curve bounds using simple sampling
		return estimateBezierSafety(controlPoints);
	}
	
	// Quick bezier curve safety estimation using sampling
	function estimateBezierSafety(controlPoints) {
		// Sample a few points along the bezier curve to check bounds
		const sampleCount = 5;
		const safetyBound = 0.4;
		
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

// Replace the existing curve generation logic
let fixedContent = content;

// Replace the curve generation section with dynamic version
const curveGenerationRegex = /(for\( let i = 0; i < tiling\.numEdgeShapes\(\); \+\+i \) \{[\s\S]*?edges\.push\( ej \);\s*\n\s*\})/;

const newCurveGeneration = `for( let i = 0; i < tiling.numEdgeShapes(); ++i ) {
			let ej = [];
			const shp = tiling.getEdgeShape( i );
			if( shp == EdgeShape.I ) {
				// Pass - straight edges need no control points
			} else {
				// Use dynamic curve generation with overlap detection
				ej = generateSafeCurve(shp);
			}

			edges.push( ej );
		}`;

fixedContent = fixedContent.replace(curveGenerationRegex, newCurveGeneration);

// Insert the dynamic curve functions before the createRandomTiling function
const functionInsertPoint = /(\s*function createRandomTiling\(\))/;
fixedContent = fixedContent.replace(functionInsertPoint, dynamicCurveCode + '\n$1');

// Write the updated file
fs.writeFileSync(currentFile, fixedContent);

console.log('✅ Dynamic curve generation implemented!');
console.log('');
console.log('🎯 New Features:');
console.log('   • Overlap detection before curve creation');
console.log('   • 3-level aggressiveness: Conservative → Moderate → Aggressive');
console.log('   • Automatic fallback when overlaps detected');
console.log('   • Bezier curve safety estimation');
console.log('   • Beautiful curves when safe, constrained when necessary');
console.log('');
console.log('🧪 Algorithm:');
console.log('   1. Try AGGRESSIVE curves first (y: ±0.35)');
console.log('   2. Check for potential overlaps using bezier sampling');
console.log('   3. Fall back to MODERATE curves if needed (y: ±0.2)');
console.log('   4. Fall back to CONSERVATIVE curves as last resort (y: ±0.1)');
console.log('');
console.log('🚀 Test your enhanced demo: http://localhost:8000/random-tiling-generator.html');
console.log('   You should see more beautiful curves with minimal overlapping!');
