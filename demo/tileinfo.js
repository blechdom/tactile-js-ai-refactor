/*
 * Tactile-JS
 * Copyright 2020 Craig S. Kaplan, csk@uwaterloo.ca
 *
 * Distributed under the terms of the 3-clause BSD license.  See the
 * file "LICENSE" for more information.
 */

'use strict';

import { EdgeShape } from '../lib/constants/EdgeShape.js';
import { tilingTypes } from '../lib/constants/TilingTypes.js';
import { OptimizedIsohedralTiling } from '../lib/core/OptimizedIsohedralTiling.js';
import { mul, matchSeg } from '../lib/core/IsohedralTiling.js';
import { sub, dot, len, ptdist, normalize, inv } from './shared/MathUtils.js';

// A collection of utilities and classes that are generally useful when
// displaying and manipulating isohedral tilings interactively.

// Shortest distance from point P to line segment AB.
function distToSeg( P, A, B )
{
	const qmp = sub( B, A );
	const t = dot( sub( P, A ), qmp ) / dot( qmp, qmp );
	if( (t >= 0.0) && (t <= 1.0) ) {
		return len( sub( P, { x: A.x + t*qmp.x, y : A.y + t*qmp.y } ) );
	} else if( t < 0.0 ) {
		return len( sub( P, A ) );
	} else {
		return len( sub( P, B ) );
	}
}

function makeBox( x, y, w, h )
{
	return { x: x, y: y, w: w, h: h };
}

function hitBox( x, y, B )
{
	return (x >= B.x) && (x <= (B.x+B.w)) && (y >= B.y) && (y <= (B.y+B.h));
}

class EditableTiling
{
	constructor( ew, eh, phys_unit ) 
	{
		this.edit_w = ew;
		this.edit_h = eh;
		this.phys_unit = phys_unit;
		this.tiling = null;

		this.u_constrain = false;
	}

	setType( tp )
	{
		this.selectedTilingType = tp;
		this.tiling = new OptimizedIsohedralTiling( tp );
		this.params = this.tiling.getParameters();

		this.edges = [];
		for( let idx = 0; idx < this.tiling.numEdgeShapes(); ++idx ) {
			this.edges.push( [{ x: 0, y: 0 }, { x: 1, y: 0 }] );
		}

		this.cacheTileShape();
		this.calcEditorTransform();
	}

	getPrototile()
	{
		return this.tiling;
	}

	getEdgeShape( idx )
	{
		return this.edges[ idx ];
	}

	cacheTileShape()
	{
		this.tile_shape = [];

		for( let i of this.tiling.parts() ) {
			const ej = this.edges[i.id];
			let cur = i.rev ? (ej.length-2) : 1;
			const inc = i.rev ? -1 : 1;

			for( let idx = 0; idx < ej.length - 1; ++idx ) {
				this.tile_shape.push( mul( i.T, ej[cur] ) );
				cur += inc;
			}
		}
	}

	getTileShape()
	{
		return this.tile_shape;
	}

	calcEditorTransform()
	{
		let xmin = 1e7;
		let xmax = -1e7;
		let ymin = 1e7;
		let ymax = -1e7;

		for( let v of this.tile_shape ) {
			xmin = Math.min( xmin, v.x );
			xmax = Math.max( xmax, v.x );
			ymin = Math.min( ymin, v.y );
			ymax = Math.max( ymax, v.y );
		}

		const sc = Math.min( 
			(this.edit_w-50) / (xmax-xmin), (this.edit_h-50) / (ymax-ymin) );

		this.editor_T = mul( 
			[sc, 0, 0.5*this.edit_w, 0, -sc, 0.5*this.edit_h],
			[1, 0, -0.5*(xmin+xmax), 0, 1, -0.5*(ymin+ymax)] );
	}

	getEditorTransform()
	{
		return this.editor_T;
	}

	setEditorTransform( T )
	{
		this.editor_T = T;
	}

	getParam( idx )
	{
		return this.params[ idx ];
	}

	setParam( idx, v )
	{
		this.params[ idx ] = v;
		this.tiling.setParameters( params );
		this.cacheTileShape();
	}

	setParams( vs )
	{
		this.tiling.setParameters( vs );
		this.cacheTileShape();
	}

	numParams()
	{
		return this.tiling.numParameters();
	}

	startEdit( pt, do_del = false )
	{
		for( let i of this.tiling.parts() ) {
			const shp = i.shape;

			// No interaction possible with an I edge.
			if( shp == EdgeShape.I ) {
				continue;
			}

			const id = i.id;
			let ej = this.edges[id];
			const T = mul( this.editor_T, i.T );
			let P = mul( T, ej[0] );

			for( let idx = 1; idx < ej.length; ++idx ) {
				let Q = mul( T, ej[idx] );
				if( ptdist( Q, pt ) < 0.5 * this.phys_unit ) {
					this.u_constrain = false;
					if( idx == (ej.length-1) ) {
						if( shp == EdgeShape.U && !i.second ) {
							this.u_constrain = true;
						} else {
							break;
						}
					} else if( do_del ) {
						ej.splice( idx, 1 );
						this.cacheTileShape();
						return false;
					}

					this.drag_edge_shape = id;
					this.drag_vertex = idx;
					this.drag_T = inv( T );
					this.down_motion = pt;

					// Set timer for deletion.  But not on a U vertex.
					if( !this.u_constrain ) {
						this.delete_timer = setTimeout(
							this.deleteVertex, 1000 );
					}

					return true;
				}

				// Check segment
				if( distToSeg( pt, P, Q ) < 20 ) {
					this.drag_edge_shape = id;
					this.drag_vertex = idx;
					this.drag_T = inv( T );
					this.down_motion = pt;
					// Don't set timer -- can't delete new vertex.

					ej.splice( idx, 0, mul( this.drag_T, pt ) );
					this.cacheTileShape();

					return true;
				}

				P = Q;
			}
		}

		return false;
	}

	moveEdit( pt )
	{
		const npt = mul( this.drag_T, pt );

		if( this.u_constrain ) {
			npt.x = 1.0;
		}

		const d = ptdist( pt, this.down_motion );
		if( d > 10 ) {
			// You've moved far enough, so don't delete.
			if( this.delete_timer != null ) {
				clearTimeout( this.delete_timer );
				this.delete_timer = null;
			}
		}

		this.edges[this.drag_edge_shape][this.drag_vertex] = npt;
		this.cacheTileShape();
	}

	finishEdit()
	{
		this.u_constrain = false;

		if( this.delete_timer ) {
			clearTimeout( this.delete_timer );
			this.delete_timer = null;
		}
	}
};

export {
	sub,
	dot,
	len,
	ptdist,
	normalize,
	inv,
	distToSeg,
	makeBox,
	hitBox,
	EditableTiling
};
