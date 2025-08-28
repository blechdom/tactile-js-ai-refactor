/*
 * Spiral Demo Colouring Data Classes
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

import { Permutation } from './Permutation.js';

/**
 * Base class for tiling coloring schemes
 * Manages color mapping based on permutations and positions
 */
export class Colouring {
    /**
     * Create a colouring scheme
     * @param {Object} tiling - The tiling object
     * @param {Array} cols - Array of colors
     * @param {Array} init - Initial color indices for each aspect
     * @param {Array} p1 - First permutation
     * @param {Array} p2 - Second permutation
     */
    constructor(tiling, cols, init, p1, p2) {
        this.tiling = tiling;
        this.cols = cols;
        this.init = init;
        this.p1 = p1;
        this.p1rank = Permutation.rank(p1);
        this.p2 = p2;
        this.p2rank = Permutation.rank(p2);
    }

    /**
     * Get color for a specific position and aspect
     * @param {number} a - First coordinate
     * @param {number} b - Second coordinate  
     * @param {number} asp - Aspect index
     * @returns {Array} RGB color array
     */
    getColour(a, b, asp) {
        /*
        const nc = this.cols.length;
        let mt = function(a) {
            let _mt = a % nc;
            return _mt < 0 ? _mt + nc : _mt;
        };
        c = Permutation.evaluate(this.p1, c, mt(a));
        c = Permutation.evaluate(this.p2, c, mt(b));
        */
        
        let c = this.init[asp];
        const r1 = this.p1rank;
        const r2 = this.p2rank;

        c = Permutation.evaluate(this.p1, c, ((a % r1) + r1) % r1);
        c = Permutation.evaluate(this.p2, c, ((b % r2) + r2) % r2);

        return this.cols[c];
    }
}

/**
 * Uniform coloring scheme - uses a single color for all tiles
 */
export class UniformColouring extends Colouring {
    /**
     * Create a uniform coloring scheme
     * @param {Object} tiling - The tiling object
     * @param {Array} col - Single color to use for all tiles
     */
    constructor(tiling, col) {
        const nasps = tiling.numAspects();
        const init = new Array(nasps).fill(0);
        const p = [0];
        super(tiling, [col], init, p, p);
    }
}

/**
 * Minimal coloring scheme - uses the tiling's built-in coloring data
 */
export class MinColouring extends Colouring {
    /**
     * Create a minimal coloring scheme from tiling data
     * @param {Object} tiling - The tiling object
     * @param {Array} cols - Array of colors to use
     */
    constructor(tiling, cols) {
        const clrg = tiling.ttd.colouring;
        const init = clrg.slice(0, tiling.numAspects());
        const p1 = clrg.slice(12, 15);
        const p2 = clrg.slice(15, 18);
        super(tiling, cols, init, p1, p2);
    }
}

export default { Colouring, UniformColouring, MinColouring };
