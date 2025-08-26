/*
 * Tactile-JS Spiral Tilings Demo
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Refactored for modular structure
 *
 * Distributed under the terms of the 3-clause BSD license.  See the
 * file "LICENSE" for more information.
 */

'use strict';

import { fitCurve } from './fit-curve.js';
import { earcut } from './earcut.js';
import { EdgeShape } from '../lib/constants/EdgeShape.js';
import { tilingTypes } from '../lib/constants/TilingTypes.js';
import { OptimizedIsohedralTiling } from '../lib/core/OptimizedIsohedralTiling.js';
import { mul, matchSeg } from '../lib/core/IsohedralTiling.js';
import { PHYSICAL_UNIT, RGB_MAX } from '../demo/shared/Constants.js';

function sketch( p5c )
{
	let selectedTilingType = null;
	let parameters = null;
	let tiling = null;
	let edges = null;
	let tileShape = null;
	let triangles = null;

	let colouring = null;
	let uniformColouring = null;
	let minColouring = null;

	let physicalUnit; // Ideally, about a centimeter
	let editBox = null;

	const MODE_NONE = 9000;
	const MODE_MOVE_VERTEX = 9001;
	const MODE_ADJ_TILE = 9002;
	const MODE_ADJ_TV = 9003;
	const MODE_ADJ_TILING = 9004;

	let spiralA = 1;
	let spiralB = 5;
	let tilingV = { x: 0.0, y: 0.0 };
	let tilingT = null;
	let tilingInverseT = null;

	let tilingVDown = null;

	let currentMode = MODE_NONE;
	let dragTilingVertex = null;
	let dragTilingVertexOffset = null;

	let editorT;
	let editorTDown;
	let dragEdgeShape = -1;
	let dragVertex = -1;
	let dragT = null;
	let constrainU = false;

	let downMotion = null;
	let deleteTimer = null;
	let isAnimating = false;
	let isFullscreen = false;
	let useColor = false;

	let font = null;

	let messages = [];
	let DEBUG = true;
	function debugLog( message ) {
		if( DEBUG ) {
			messages.push( message );
			p5c.loop();
		}
	}

	let canvasWidth = null;
	let canvasHeight = null;
	const FBO_DIMENSION = 256;
	let frameBuffer = null;
	let frameBufferMatrix = null;

	let isohedralSlider = null;
	let isohedralLabel = null;

	let sliderA = null;
	let labelA = null;
	let sliderB = null;
	let labelB = null;
	let mobiusTransform = false;

	let tilingVertexSliders = null;

	let helpButton = null;
	let fullscreenButton = null;
	let colorButton = null;
	let animateButton = null;
	let saveButton = null;

	const COLORS = [
		[ 25, 52, 65 ],
		[ 62, 96, 111 ],
		[ 145, 170, 157 ],
		[ 209, 219, 189 ],
		[ 252, 255, 245 ],
		[ 219, 52, 69 ],
		[ 242, 99, 75 ],
		[ 249, 199, 79 ],
		[ 143, 190, 0 ],
		[ 51, 131, 167 ]
	];

	function resetTiling()
	{
		selectedTilingType = Math.floor( p5c.random() * tilingTypes.length );

		debugLog( "Tiling type: " + selectedTilingType );
		tiling = new OptimizedIsohedralTiling( tilingTypes[selectedTilingType] );

		parameters = tiling.getParameters();
		for( let idx = 0; idx < parameters.length; ++idx ) {
			parameters[idx] = p5c.random();
		}
		tiling.setParameters( parameters );

		edges = [];
		for( let idx = 0; idx < tiling.numEdgeShapes(); ++idx ) {
			let edgeData = [];
			const shape = tiling.getEdgeShape( idx );

			if( shape == EdgeShape.I ) {
				// Straight edge - no control points
			} else if( shape == EdgeShape.J ) {
				edgeData.push( { x: p5c.random() * 0.5, y : p5c.random() - 0.5 } );
				edgeData.push( { x: 0.5 + p5c.random() * 0.5, y : p5c.random() - 0.5 } );
			} else if( shape == EdgeShape.S ) {
				edgeData.push( { x: p5c.random() * 0.5, y : p5c.random() - 0.5 } );
				edgeData.push( { x: 1.0 - edgeData[0].x, y: -edgeData[0].y } );
			} else if( shape == EdgeShape.U ) {
				edgeData.push( { x: p5c.random() * 0.5, y : p5c.random() - 0.5 } );
				edgeData.push( { x: 1.0 - edgeData[0].x, y: edgeData[0].y } );
			}

			edges.push( edgeData );
		}

		recomputeTileShape();
		recomputeColouring();
		recomputeFrameBuffer();

		if( tilingVertexSliders ) {
			updateTilingVertexSliders();
		}
	}

	function recomputeTileShape()
	{
		tileShape = [];

		// Add first vertex
		tileShape.push( tiling.getVertex( 0 ) );

		for( let shapeInfo of tiling.shape() ) {
			const transform = mul( editorT, shapeInfo.T );
			
			if( shapeInfo.shape == EdgeShape.I ) {
				// Straight edge
				const endPoint = { x: shapeInfo.rev ? 0.0 : 1.0, y: 0.0 };
				tileShape.push( mul( transform, endPoint ) );
			} else {
				// Curved edge
				const edgeData = edges[shapeInfo.id];
				
				if( shapeInfo.rev ) {
					// Reversed edge
					const pt1 = { x: 1.0, y: 0.0 };
					const cp2 = { x: 1.0 - edgeData[1].x, y: -edgeData[1].y };
					const cp1 = { x: 1.0 - edgeData[0].x, y: -edgeData[0].y };
					const pt2 = { x: 0.0, y: 0.0 };
					
					// Sample bezier curve points
					for( let t = 0.1; t <= 1.0; t += 0.1 ) {
						const u = 1.0 - t;
						const bezierPoint = {
							x: u*u*u*pt1.x + 3*u*u*t*cp1.x + 3*u*t*t*cp2.x + t*t*t*pt2.x,
							y: u*u*u*pt1.y + 3*u*u*t*cp1.y + 3*u*t*t*cp2.y + t*t*t*pt2.y
						};
						tileShape.push( mul( transform, bezierPoint ) );
					}
				} else {
					// Normal edge
					const pt1 = { x: 0.0, y: 0.0 };
					const cp1 = edgeData[0];
					const cp2 = edgeData[1];
					const pt2 = { x: 1.0, y: 0.0 };
					
					// Sample bezier curve points
					for( let t = 0.1; t <= 1.0; t += 0.1 ) {
						const u = 1.0 - t;
						const bezierPoint = {
							x: u*u*u*pt1.x + 3*u*u*t*cp1.x + 3*u*t*t*cp2.x + t*t*t*pt2.x,
							y: u*u*u*pt1.y + 3*u*u*t*cp1.y + 3*u*t*t*cp2.y + t*t*t*pt2.y
						};
						tileShape.push( mul( transform, bezierPoint ) );
					}
				}
			}
		}

		// Triangulate the tile shape for rendering
		const coords = [];
		for( let vertex of tileShape ) {
			coords.push( vertex.x, vertex.y );
		}
		triangles = earcut( coords );
	}

	function recomputeColouring()
	{
		// Simple coloring scheme for now
		colouring = [0, 1, 2];
		uniformColouring = true;
		minColouring = false;
	}

	function recomputeFrameBuffer()
	{
		// Placeholder for framebuffer operations
		// In a full implementation, this would set up WebGL framebuffers for rendering
	}

	function updateTilingVertexSliders()
	{
		// Update sliders based on current tiling vertices
		// Implementation would depend on UI framework being used
	}

	function drawSpiral()
	{
		if( !tiling || !tileShape ) return;

		p5c.push();
		
		// Set up spiral parameters
		const centerX = canvasWidth / 2;
		const centerY = canvasHeight / 2;
		const maxRadius = Math.min(centerX, centerY) * 0.8;
		
		// Draw spiral tiling
		for( let radius = 10; radius < maxRadius; radius += 20 ) {
			const circumference = 2 * Math.PI * radius;
			const tileWidth = 40; // Approximate tile width
			const numTiles = Math.floor(circumference / tileWidth);
			
			for( let i = 0; i < numTiles; i++ ) {
				const angle = (i / numTiles) * 2 * Math.PI;
				const spiralAngle = angle * spiralA + radius * spiralB * 0.01;
				
				p5c.push();
				p5c.translate(centerX, centerY);
				p5c.rotate(spiralAngle);
				p5c.translate(radius, 0);
				p5c.scale(0.5);
				
				// Draw the tile
				if( useColor ) {
					const colorIndex = i % COLORS.length;
					p5c.fill(COLORS[colorIndex][0], COLORS[colorIndex][1], COLORS[colorIndex][2]);
				} else {
					p5c.fill(RGB_MAX);
				}
				p5c.stroke(0);
				p5c.strokeWeight(1);
				
				p5c.beginShape();
				for( let vertex of tileShape ) {
					p5c.vertex(vertex.x * 30, vertex.y * 30);
				}
				p5c.endShape(p5c.CLOSE);
				
				p5c.pop();
			}
		}
		
		p5c.pop();
	}

	function drawUI()
	{
		// Draw debug messages
		if( messages.length > 0 ) {
			p5c.fill(0);
			for( let i = 0; i < Math.min(5, messages.length); i++ ) {
				p5c.text( messages[messages.length - 1 - i], 10, 30 + i * 20 );
			}
		}

		// Draw spiral parameters
		p5c.fill(0);
		p5c.text(`Spiral A: ${spiralA}`, 10, canvasHeight - 60);
		p5c.text(`Spiral B: ${spiralB}`, 10, canvasHeight - 40);
		p5c.text(`Tiling Type: IH${selectedTilingType + 1}`, 10, canvasHeight - 20);
	}

	// p5.js lifecycle functions
	p5c.setup = function()
	{
		canvasWidth = 800;
		canvasHeight = 600;
		let canvas = p5c.createCanvas( canvasWidth, canvasHeight );
		canvas.parent( "sktch" );

		physicalUnit = PHYSICAL_UNIT;
		editorT = [ 1, 0, 0, 0, 1, 0 ];

		resetTiling();
		p5c.noLoop();
	}

	p5c.draw = function()
	{
		p5c.background( 240 );
		
		drawSpiral();
		drawUI();
		
		p5c.noLoop(); // Only redraw when needed
	}

	p5c.keyPressed = function()
	{
		if( p5c.key === 'r' || p5c.key === 'R' ) {
			resetTiling();
			p5c.loop();
		} else if( p5c.key === 'c' || p5c.key === 'C' ) {
			useColor = !useColor;
			p5c.loop();
		} else if( p5c.key === 'a' || p5c.key === 'A' ) {
			isAnimating = !isAnimating;
			if( isAnimating ) {
				p5c.loop();
			}
		} else if( p5c.keyCode === p5c.UP_ARROW ) {
			spiralA += 0.1;
			p5c.loop();
		} else if( p5c.keyCode === p5c.DOWN_ARROW ) {
			spiralA -= 0.1;
			p5c.loop();
		} else if( p5c.keyCode === p5c.LEFT_ARROW ) {
			spiralB -= 0.1;
			p5c.loop();
		} else if( p5c.keyCode === p5c.RIGHT_ARROW ) {
			spiralB += 0.1;
			p5c.loop();
		}
	}

	p5c.mousePressed = function()
	{
		// Simple interaction - clicking generates a new tiling
		if( p5c.mouseX >= 0 && p5c.mouseX <= canvasWidth && 
		    p5c.mouseY >= 0 && p5c.mouseY <= canvasHeight ) {
			resetTiling();
			p5c.loop();
		}
	}
}

// Access p5 from window object since we're in a module
const p5Constructor = window.p5 || p5;
let spiralDemo = new p5Constructor( sketch, 'sketch' );
