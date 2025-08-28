/*
 * Spiral Demo Permutation Data Class
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

/**
 * Permutation operations for spiral tiling mathematics
 * Handles permutation arrays used in spiral transformations and coloring
 */
export class Permutation {
    /**
     * Calculate the rank (order) of a permutation
     * @param {Array} p - Permutation array
     * @returns {number} The rank/order of the permutation
     */
    static rank(p) {
        let identity = Object.keys(p);
        let product = p.slice();
        let rank = 1;
        while (product.join() !== identity.join()) {
            product = this.mult(product, p);
            rank++;
        }
        return rank;
    }

    /**
     * Raise a permutation to a power
     * @param {Array} p - Permutation array
     * @param {number} exp - Exponent
     * @returns {Array} Permutation raised to the power
     */
    static pow(p, exp) {
        let product = p.slice();
        for (let i = 0; i < exp - 1; i++) {
            product = this.mult(product, p);
        }
        return product;
    }

    /**
     * Multiply two permutations
     * @param {Array} p1 - First permutation
     * @param {Array} p2 - Second permutation
     * @returns {Array} Product of the permutations
     */
    static mult(p1, p2) {
        if (p1.length !== p2.length) {
            return [];
        }
        return p1.map(x => p2[x]);
    }

    /**
     * Evaluate a permutation starting from a position for a number of iterations
     * @param {Array} p - Permutation array
     * @param {number} start - Starting position
     * @param {number} num_times - Number of times to apply the permutation
     * @returns {number} Final position after iterations
     */
    static evaluate(p, start, num_times) {
        let val = p[start];
        for (let idx = 0; idx < num_times; ++idx) {
            val = p[val];
        }
        return val;
    }
}

export default Permutation;
