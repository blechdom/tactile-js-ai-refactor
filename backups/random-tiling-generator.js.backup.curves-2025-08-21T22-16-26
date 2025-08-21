/*
 * Tactile-JS
 * Copyright 2018 Craig S. Kaplan, csk@uwaterloo.ca
 *
 * Distributed under the terms of the 3-clause BSD license.  See the
 * file "LICENSE" for more information.
 */

import { mul, matchSeg, EdgeShape, numTypes, tilingTypes, IsohedralTiling } 
	from '../lib/tactile.js';

let sktch = function( p5c )
{
	let cur_tiling = null;
	let animationEnabled = true;

	function sub( V, W ) { return { x: V.x-W.x, y: V.y-W.y }; };
	function dot( V, W ) { return V.x*W.x + V.y*W.y; };
	function len( V ) { return p5c.sqrt( dot( V, V ) ); }

	function inv( T ) {
		const det = T[0]*T[4] - T[1]*T[3];
		return [T[4]/det, -T[1]/det, (T[1]*T[5]-T[2]*T[4])/det,
			-T[3]/det, T[0]/det, (T[2]*T[3]-T[0]*T[5])/det];
	};

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
		infoHTML += `Scale: ${tilingData.sc.toFixed(2)}`;

		infoDiv.innerHTML = infoHTML;
	}

	function createRandomTiling()
	{
		const tilingTypeIndex = Math.floor( 81 * p5c.random() );
		const tp = tilingTypes[ tilingTypeIndex ];

		let tiling = new IsohedralTiling( tp );
		let ps = tiling.getParameters();
		for( let i = 0; i < ps.length; ++i ) {
			ps[i] += p5c.random() * 0.3 - 0.15;
		}
		tiling.setParameters( ps );

		let edges = [];
		for( let i = 0; i < tiling.numEdgeShapes(); ++i ) {
			let ej = [];
			const shp = tiling.getEdgeShape( i );
			if( shp == EdgeShape.I ) {
				// Pass
			} else if( shp == EdgeShape.J ) {
				ej.push( { x: Math.random()*0.6, y : Math.random() - 0.5 } );
				ej.push( { x: Math.random()*0.6 + 0.4, y : Math.random() - 0.5 } );
			} else if( shp == EdgeShape.S ) {
				ej.push( { x: Math.random()*0.6, y : Math.random() - 0.5 } );
				ej.push( { x: 1.0 - ej[0].x, y: -ej[0].y } );
			} else if( shp == EdgeShape.U ) {
				ej.push( { x: Math.random()*0.6, y : Math.random() - 0.5 } );
				ej.push( { x: 1.0 - ej[0].x, y: ej[0].y } );
			}

			edges.push( ej );
		}

		let cols = [];
		for( let i = 0; i < 3; ++i ) {
			cols.push( [
				Math.floor( Math.random() * 255.0 ), 
				Math.floor( Math.random() * 255.0 ), 
				Math.floor( Math.random() * 255.0 ) ] );
		}

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
		p5c.strokeWeight( 0.5 );
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

		cur_tiling = createRandomTiling();
		displayTilingInfo( cur_tiling );
		
		// Set up animation toggle event listener
		const animationToggle = document.getElementById('animation-toggle');
		if (animationToggle) {
			animationToggle.addEventListener('change', function() {
				animationEnabled = this.checked;
			});
		}
	}

	p5c.draw = function()
	{
		p5c.background( 255 );

		drawTiling( cur_tiling, 255 );
		
		// Only animate if animation is enabled
		if (animationEnabled) {
			cur_tiling.tx += cur_tiling.dx;
			cur_tiling.ty += cur_tiling.dy;
		}
	}

	p5c.mousePressed = function()
	{
		// Only respond to clicks within the canvas bounds
		if (p5c.mouseX >= 0 && p5c.mouseX <= p5c.width && 
		    p5c.mouseY >= 0 && p5c.mouseY <= p5c.height) {
			cur_tiling = createRandomTiling();
			displayTilingInfo( cur_tiling );
		}
	}
};

let myp5 = new p5( sktch, 'sktch' );
