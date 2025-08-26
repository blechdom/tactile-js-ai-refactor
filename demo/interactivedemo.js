/*
 * Tactile-JS
 * Copyright 2018 Craig S. Kaplan, csk@uwaterloo.ca
 *
 * Distributed under the terms of the 3-clause BSD license.  See the
 * file "LICENSE" for more information.
 */

// A port of the Tactile C++ demo program to P5.js.

import { makeBox, EditableTiling } from './tileinfo.js';
import { EdgeShape } from '../lib/constants/EdgeShape.js';
import { tilingTypes } from '../lib/constants/TilingTypes.js';
import { IsohedralTiling, mul } from '../lib/core/IsohedralTiling.js';
import { PHYSICAL_UNIT, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT, RGB_MAX, UI_BACKGROUND } from './shared/Constants.js';
import { generateRandomColors } from './shared/ColorUtils.js';

let sketch = function( p5c )
{
	const editor_box = makeBox( 10, 350, 200, 240 );
	const phys_unit = PHYSICAL_UNIT;

	let quickSettingsUI = null;
	let settingsValues = null;

	let editor_pane = null;
	let show_controls = true;
	let zoom = 1.0;

	let selectedTilingType = null;
	let tiling = null;

	let dragging = null;
	let colorMode = true; // true = colors, false = outlines only

	let COLS = [
		[ 25, 52, 65 ],
		[ 62, 96, 111 ],
		[ 145, 170, 157 ],
		[ 209, 219, 189 ],
		[ 252, 255, 245 ],
		[ 219, 188, 209 ] ];

	// Using shared generateRandomColors utility

	function randomizeColors() {
		COLS = generateRandomColors(6);
		p5c.loop();
	}

	function toggleColorMode(data) {
		// Handle different possible data structures
		if (data && typeof data.value !== 'undefined') {
			colorMode = data.value;
		} else if (typeof data === 'boolean') {
			colorMode = data;
		} else {
			// Fallback - just toggle manually
			colorMode = !colorMode;
		}
		
		// Show/hide Random Colors button based on color mode
		if (colorMode) {
			quickSettingsUI.showControl("Random Colors");
		} else {
			quickSettingsUI.hideControl("Random Colors");
		}
		
		p5c.loop();
	}

	function setTilingType()
	{
		const tp = tilingTypes[ selectedTilingType ];
		tiling.setType( tp );

		// Generate new colors for each tiling type
		COLS = generateRandomColors(6);

		let title = "Tiling: IH";
		if( tp < 10 ) {
			title += "0";
		}
		title += tp;

		// I'd like to say this: QS.setTitle( title );
		// QuickSettings doesn't include a public API for setting the
		// title of a panel, so reach into the guts and twiddle the
		// data directly.
		quickSettingsUI._titleBar.textContent = title;

		const np = tiling.numParams();
		settingsValues = {};
		for( let idx = 0; idx < 6; ++idx ) {
			if( idx < np ) {
				quickSettingsUI.showControl( "v" + idx );
				settingsValues["v"+idx] = tiling.getParam( idx );
			} else {
				quickSettingsUI.hideControl( "v" + idx );
			}
		}
		quickSettingsUI.setValuesFromJSON( settingsValues );
	}

	function nextTilingType()
	{
		if( selectedTilingType < (tilingTypes.length-1) ) {
			selectedTilingType++;
			setTilingType();
		}
	}

	function prevTilingType()
	{
		if( selectedTilingType > 0 ) {
			selectedTilingType--;
			setTilingType();
		}
	}

	function drawTiling()
	{
		const asp = p5c.width / p5c.height;
		const h = 6.0 * zoom;
		const w = asp * h * zoom;
		const sc = p5c.height / (2*h);
		const M = mul(
			[1, 0, p5c.width/2.0, 0, 1, p5c.height/2.0],
			[sc, 0, 0, 0, -sc, 0] );

		const proto = tiling.getPrototile();

		for( let i of proto.fillRegionBounds(-w-2.0, -h-2.0, w+2.0, h+2.0) ) {
			const TT = i.T;
			const T = mul( M, TT );

			if (colorMode) {
				// Color mode - use color fills
				const col = COLS[ proto.getColour( i.t1, i.t2, i.aspect ) + 1 ];
				p5c.fill( col[0], col[1], col[2] );
				p5c.stroke( COLS[0][0], COLS[0][1], COLS[0][2] );
				p5c.strokeWeight( 1.0 );
			} else {
				// Outline mode - black and white only
				p5c.noFill();
				p5c.stroke( 0 );
				p5c.strokeWeight( 1.5 );
			}

			p5c.beginShape();
			for( let v of tiling.getTileShape() ) {
				const P = mul( T, v );
				p5c.vertex( P.x, P.y );
			}
			p5c.endShape( p5c.CLOSE );
		}
	}

	function drawEditor()
	{
		let pg = editor_pane;
		pg.clear();

		pg.fill( 252, 255, 254, 220 );
		pg.noStroke();
		pg.rect( 0, 0, editor_box.w, editor_box.h );

		pg.strokeWeight( 2.0 );
		pg.fill( COLS[3][0], COLS[3][1], COLS[3][2] );

		const ET = tiling.getEditorTransform();
		const proto = tiling.getPrototile();

		pg.beginShape();
		for( let v of tiling.getTileShape() ) {
			const P = mul( ET, v );
			pg.vertex( P.x, P.y );
		}
		pg.endShape( p5c.CLOSE );

		pg.noFill();

		// Draw edges
		for( let i of proto.parts() ) {
			if( i.shape == EdgeShape.I ) {
				pg.stroke( 158 );
			} else {
				pg.stroke( 0 );
			}

			const M = mul( ET, i.T );
			pg.beginShape();
			for( let v of tiling.getEdgeShape( i.id ) ) {
				const P = mul( M, v );
				pg.vertex( P.x, P.y );
			}
			pg.endShape();
		}

		// Draw tiling vertices
		pg.noStroke();
		pg.fill( 158 );
		for( let v of proto.vertices() ) {
			const pt = mul( ET, v );
			pg.ellipse( pt.x, pt.y, 10.0, 10.0 );
		}

		// Draw editable vertices
		for( let i of proto.parts() ) {
			const shp = i.shape;
			const id = i.id;
			const ej = tiling.getEdgeShape( id );
			const T = mul( ET, i.T );

			for( let idx = 1; idx < ej.length - 1; ++idx ) {
				pg.fill( 0 );
				const pt = mul( T, ej[idx] );
				pg.ellipse( pt.x, pt.y, 10.0, 10.0 );
			}

			if( shp == EdgeShape.I || shp == EdgeShape.J ) {
				continue;
			}

			// Draw symmetry points for U and S edges.
			if( !i.second ) {
				if( shp == EdgeShape.U ) {
					pg.fill( COLS[2][0], COLS[2][1], COLS[2][2] );
				} else {
					pg.fill( COLS[5][0], COLS[5][1], COLS[5][2] );
				}
				const pt = mul( T, ej[ej.length-1] );
				pg.ellipse( pt.x, pt.y, 10.0, 10.0 );
			}
		}

		p5c.image( pg, editor_box.x, editor_box.y );

		p5c.strokeWeight( 3.0 );
		p5c.stroke( 25, 52, 65, 220 );
		p5c.noFill();
		p5c.rect( editor_box.x, editor_box.y, editor_box.w, editor_box.h );
	}

	function slide()
	{
		let params = []
		settingsValues = quickSettingsUI.getValuesAsJSON();
		for( let idx = 0; idx < tiling.numParams(); ++idx ) {
			params.push( settingsValues[ "v" + idx ] );
		}
		tiling.setParams( params );
		p5c.loop();
	}

	p5c.mouseDragged = function()
	{
		if( dragging ) {
			const npt = 
				{ x: p5c.mouseX - editor_box.x, y: p5c.mouseY - editor_box.y };
			tiling.moveEdit( npt );
			p5c.loop();
			return false;
		}
	}

	p5c.mousePressed = function()
	{
		dragging = false;
		if( !show_controls ) {
			return;
		}

		const pt = {
			x: p5c.mouseX - editor_box.x, y: p5c.mouseY - editor_box.y };

		if( (pt.x < 0) || (pt.x > editor_box.w) ) {
			return;
		}
		if( (pt.y < 0) || (pt.y > editor_box.h) ) {
			return;
		}

		if( tiling.startEdit( pt, p5c.keyIsDown( p5c.SHIFT ) ) ) {
			dragging = true;
			p5c.loop();
		} else {
			tiling.calcEditorTransform();
			p5c.loop();
		}
	}

	p5c.mouseReleased = function()
	{
		tiling.finishEdit();
		dragging = false;
	}

	p5c.keyPressed = function()
	{
		if( p5c.keyCode === p5c.RIGHT_ARROW ) {
			nextTilingType();
			p5c.loop();
		} else if( p5c.keyCode === p5c.LEFT_ARROW ) {
			prevTilingType();
			p5c.loop();
		} else if( p5c.key == ' ' ) {
			show_controls = !show_controls;
			if( show_controls ) {
				quickSettingsUI.expand();
			} else {
				quickSettingsUI.collapse();
			}
			p5c.loop();
		} else if( p5c.key == ',' || p5c.key == '<' ) {
			zoom /= 0.9;
			p5c.loop();
		} else if( p5c.key == '.' || p5c.key == '>' ) {
			zoom *= 0.9;
			p5c.loop();
		}
	}

	p5c.setup = function()
	{
		let canvas = p5c.createCanvas( DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT );
		canvas.parent( "sktch" );

		tiling = new EditableTiling( editor_box.w, editor_box.h, phys_unit );

		let res = document.getElementById( "sktch" ).getBoundingClientRect();
		quickSettingsUI = QuickSettings.create(
			res.left + window.scrollX + 10, res.top + window.scrollY + 10, 
			"Tiling: IH01" );
		for( let idx = 0; idx < 6; ++idx ) {
			quickSettingsUI.addRange( "v" + idx, 0, 2, 1, 0.0001, null );
			quickSettingsUI.hideControl( "v" + idx );
		}
		
		// Add color/outline toggle first
		quickSettingsUI.addBoolean( "Color Mode", colorMode, toggleColorMode );
		
		// Add random colors button
		quickSettingsUI.addButton( "Random Colors", randomizeColors );
		
		// Initialize Random Colors button visibility based on initial colorMode
		if (!colorMode) {
			quickSettingsUI.hideControl("Random Colors");
		}

		editor_pane = p5c.createGraphics( editor_box.w, editor_box.h );

		quickSettingsUI.setGlobalChangeHandler( slide );
		selectedTilingType = 0;
		setTilingType();
	}

	p5c.draw = function()
	{
		p5c.background( RGB_MAX );

		drawTiling();

		if( show_controls ) {
			drawEditor();
		}

		p5c.noLoop();
	}
}

let myp5 = new p5( sketch, 'sketch0' );
