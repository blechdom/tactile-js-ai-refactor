/*
 * Tactile-JS
 * Copyright 2018 Craig S. Kaplan, csk@uwaterloo.ca
 *
 * Distributed under the terms of the 3-clause BSD license.  See the
 * file "LICENSE" for more information.
 */

import { EdgeShape } from '../lib/constants/EdgeShape.js';
import { tilingTypes } from '../lib/constants/TilingTypes.js';
import { OptimizedIsohedralTiling } from '../lib/core/OptimizedIsohedralTiling.js';
import { mul, matchSeg } from '../lib/core/IsohedralTiling.js';
import { PARAMETER_VARIATION, PARAMETER_VARIATION_HALF, BEZIER_CURVE_RANGE, HALF, STROKE_WEIGHT_THIN, RGB_MAX } from './shared/Constants.js';
import { sub, dot, inv, len } from '../lib/utils/MathUtils.js';
import { generateRandomColors } from './shared/ColorUtils.js';

let sketch = function( p5c )
{
	let currentTiling = null;
	let animationEnabled = true;

	// Math utilities now imported from lib/utils/MathUtils.js

	function displayTilingInfo(tilingData) 
	{
		const infoDiv = document.getElementById('tiling-info');
		if (!infoDiv) return;

		const edgeShapeNames = {
			[EdgeShape.I]: "I (straight)",
			[EdgeShape.J]: "J (arbitrary curve)", 
			[EdgeShape.S]: "S (symmetric curve)",
			[EdgeShape.U]: "U (mirrored curve)"
		};

		let infoHTML = `<strong>Tiling Type:</strong> IH${tilingData.tilingTypeIndex + 1}<br/>`;
		infoHTML += `<strong>Parameters:</strong> [${tilingData.parameters.map(p => p.toFixed(3)).join(', ')}]<br/>`;
		
		infoHTML += `<strong>Edge Shapes:</strong> `;
		const edgeShapes = [];
		for (let i = 0; i < tilingData.tiling.numEdgeShapes(); i++) {
			const shape = tilingData.tiling.getEdgeShape(i);
			edgeShapes.push(`Edge ${i}: ${edgeShapeNames[shape] || shape}`);
		}
		infoHTML += edgeShapes.join(', ') + '<br/>';
		
		infoHTML += `<strong>Colors:</strong> RGB(${tilingData.cols[0].join(',')})`;
		for (let i = 1; i < tilingData.cols.length; i++) {
			infoHTML += `, RGB(${tilingData.cols[i].join(',')})`;
		}
		infoHTML += '<br/>';
		
		infoHTML += `<strong>Transform:</strong> Position(${tilingData.tx.toFixed(2)}, ${tilingData.ty.toFixed(2)}), `;
		infoHTML += `Rotation: ${(tilingData.theta * 180 / Math.PI).toFixed(1)}°, `;
		infoHTML += `Scale: ${tilingData.sc.toFixed(2)}<br/>`;
		
		infoDiv.innerHTML = infoHTML;
	}

	function createRandomTiling()
	{
		const tilingTypeIndex = Math.floor( tilingTypes.length * p5c.random() );
		const tp = tilingTypes[ tilingTypeIndex ];
		
		// Add logging to help debug issues
		console.log('[Random Generator] Selected tiling type index:', tilingTypeIndex);
		console.log('[Random Generator] Selected tiling type:', tp);
		
		if (!tp) {
			console.error('[Random Generator] ERROR: Tiling type is undefined for index', tilingTypeIndex);
			throw new Error(`Invalid tiling type at index ${tilingTypeIndex}`);
		}

		let tiling = new OptimizedIsohedralTiling( tp );
		let ps = tiling.getParameters();
		for( let i = 0; i < ps.length; ++i ) {
			ps[i] += p5c.random() * PARAMETER_VARIATION - PARAMETER_VARIATION_HALF;
		}
		tiling.setParameters( ps );

		let edges = [];
		for( let i = 0; i < tiling.numEdgeShapes(); ++i ) {
			let ej = [];
			const shp = tiling.getEdgeShape( i );
			if( shp == EdgeShape.I ) {
				// Pass
			} else if( shp == EdgeShape.J ) {
				ej.push( { x: Math.random()*BEZIER_CURVE_RANGE, y : (Math.random() - HALF) * 0.6 } );
				ej.push( { x: Math.random()*BEZIER_CURVE_RANGE + 0.4, y : (Math.random() - HALF) * 0.6 } );
			} else if( shp == EdgeShape.S ) {
				ej.push( { x: Math.random()*BEZIER_CURVE_RANGE, y : (Math.random() - HALF) * 0.6 } );
				ej.push( { x: 1.0 - ej[0].x, y: -ej[0].y } );
			} else if( shp == EdgeShape.U ) {
				ej.push( { x: Math.random()*BEZIER_CURVE_RANGE, y : (Math.random() - HALF) * 0.6 } );
				ej.push( { x: 1.0 - ej[0].x, y: ej[0].y } );
			}

			edges.push( ej );
		}

		let cols = generateRandomColors(3);

		const dtheta = Math.random() * p5c.TWO_PI;
		const dv = Math.random() * 0.02;

		const tilingData = {
			tiling: tiling,
			edges: edges,
			cols: cols,
			
			// Store additional info for display
			tilingTypeIndex: tilingTypeIndex,
			parameters: ps.slice(), // Copy the parameters array

			tx: Math.random() * 10.0,
			ty: Math.random() * 10.0,
			theta: Math.random() * p5c.TWO_PI,
			sc: Math.random() * 20.0 + 4.0,

			dx: dv * Math.cos( dtheta ),
			dy: dv * Math.sin( dtheta )
		};
		
		return tilingData;
	}

	function regenerateCurves(tilingData) {
		// Regenerate only the curves 
		let edges = [];
		for( let i = 0; i < tilingData.tiling.numEdgeShapes(); ++i ) {
			let ej = [];
			const shp = tilingData.tiling.getEdgeShape( i );
			if( shp == EdgeShape.I ) {
				// Pass - straight edges
			} else if( shp == EdgeShape.J ) {
				ej.push( { x: Math.random()*BEZIER_CURVE_RANGE, y : (Math.random() - HALF) * 0.6 } );
				ej.push( { x: Math.random()*BEZIER_CURVE_RANGE + 0.4, y : (Math.random() - HALF) * 0.6 } );
			} else if( shp == EdgeShape.S ) {
				ej.push( { x: Math.random()*BEZIER_CURVE_RANGE, y : (Math.random() - HALF) * 0.6 } );
				ej.push( { x: 1.0 - ej[0].x, y: -ej[0].y } );
			} else if( shp == EdgeShape.U ) {
				ej.push( { x: Math.random()*BEZIER_CURVE_RANGE, y : (Math.random() - HALF) * 0.6 } );
				ej.push( { x: 1.0 - ej[0].x, y: ej[0].y } );
			}
			edges.push( ej );
		}
		tilingData.edges = edges;
	}

	function samp( O, V, W, a, b )
	{
		return { 
			x: O.x + a * V.x + b * W.x,
			y: O.y + a * V.y + b * W.y };
	}

	function tvertex( T, p )
	{
		const P = mul( T, p );
		p5c.vertex( P.x, P.y );
	}

	function tbezier( T, ax, ay, bx, by, cx, cy )
	{
		const A = mul( T, { x: ax, y: ay } );
		const B = mul( T, { x: bx, y: by } );
		const C = mul( T, { x: cx, y: cy } );
		p5c.bezierVertex( A.x, A.y, B.x, B.y, C.x, C.y );
	}

	function drawTiling( T, alpha )
	{
		const c = Math.cos( T.theta );
		const s = Math.sin( T.theta );

		const O = { x: T.tx, y: T.ty };
		const V = { x: c, y: s };
		const W = { x: -s, y: c };

		const t1l = len( T.tiling.getT1() );
		const t2l = len( T.tiling.getT2() );
		const marg = 2.5 * p5c.sqrt( t1l*t1l + t2l*t2l );

		const pts = [
			samp( O, V, W, -marg, -marg ),
			samp( O, V, W, T.sc + marg, -marg ),
			samp( O, V, W, T.sc + marg, T.sc * (p5c.height/p5c.width) + marg ),
			samp( O, V, W, -marg, T.sc * (p5c.height/p5c.width) + marg ),
		];
		
		const M = mul( 
			[ p5c.width, 0.0, 0.0, 0.0, p5c.width, 0.0 ],
			inv( matchSeg( O, samp( O, V, W, T.sc, 0.0 ) ) ) );

		p5c.stroke( 0, alpha );
		p5c.strokeWeight( STROKE_WEIGHT_THIN );
		p5c.strokeJoin( p5c.ROUND );
		p5c.strokeCap( p5c.ROUND );

		for( let i of T.tiling.fillRegionQuad( pts[0], pts[1], pts[2], pts[3] ) ) {
			const TT = i.T;
			const CT = mul( M, TT );

			const col = T.cols[ T.tiling.getColour( i.t1, i.t2, i.aspect ) ];
			p5c.fill( col[0], col[1], col[2], alpha );

			p5c.beginShape();
			tvertex( CT, T.tiling.getVertex( 0 ) );

			for( let si of T.tiling.shape() ) {
				const S = mul( CT, si.T );
				if( si.shape == EdgeShape.I ) {
					tvertex( S, { x: si.rev ? 0.0 : 1.0, y: 0.0 } );
				} else {
					const ej = T.edges[si.id];
					if( si.rev ) {
						tbezier( S, ej[1].x, ej[1].y, ej[0].x, ej[0].y, 0.0, 0.0 );
					} else {
						tbezier( S, ej[0].x, ej[0].y, ej[1].x, ej[1].y, 1.0, 0.0 );
					}
				}
			}
			p5c.endShape( p5c.CLOSE );
		}
	}

	p5c.setup = function()
	{
		const clientWidth = document.getElementById('sktch').clientWidth;
		const clientHeight = document.getElementById('sktch').clientHeight;

		let canvas = p5c.createCanvas( clientWidth, clientHeight );
		canvas.parent( "sktch" );

		currentTiling = createRandomTiling();
		displayTilingInfo( currentTiling );
		
		// Set up animation toggle event listener
		const animationToggle = document.getElementById('animation-toggle');
		if (animationToggle) {
			animationToggle.addEventListener('change', function() {
				animationEnabled = this.checked;
			});
		}

		// Set up new curves button event listener
		const newCurvesBtn = document.getElementById('new-curves-btn');
		if (newCurvesBtn) {
			newCurvesBtn.addEventListener('click', function() {
				if (currentTiling) {
					regenerateCurves(currentTiling);
					p5c.loop();
				}
			});
		}
	}

	p5c.draw = function()
	{
		p5c.background( RGB_MAX );

		drawTiling( currentTiling, 255 );
		
		// Only animate if animation is enabled
		if (animationEnabled) {
			currentTiling.tx += currentTiling.dx;
			currentTiling.ty += currentTiling.dy;
		}
	}

	p5c.mousePressed = function()
	{
		// Only respond to clicks within the canvas bounds
		if (p5c.mouseX >= 0 && p5c.mouseX <= p5c.width && 
		    p5c.mouseY >= 0 && p5c.mouseY <= p5c.height) {
			currentTiling = createRandomTiling();
			displayTilingInfo( currentTiling );
		}
	}
};

// Access p5 from window object since we're in a module
const p5Constructor = window.p5 || p5;
let myp5 = new p5Constructor( sketch, 'sketch' );
