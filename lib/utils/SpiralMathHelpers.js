/*
 * Spiral Demo Mathematical Helper Functions
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

/**
 * Spiral-specific mathematical helper functions
 * These are pure mathematical transformations used in spiral rendering
 */

/**
 * Apply exponential spiral transformation to a point
 * Transforms a point using polar coordinates with exponential scaling
 * @param {Object} v - Point object with {x, y} coordinates
 * @returns {Object} Transformed point with {x, y} coordinates
 */
export function spiral(v) {
    return {
        x: +(Math.exp(v.x) * Math.cos(v.y)),
        y: +(Math.exp(v.x) * Math.sin(v.y))
    };
}

/**
 * Divide a line segment between two points in the ratio m:n
 * Returns the point that divides the line segment from v1 to v2 into ratio m:n
 * @param {Object} v1 - First point with {x, y} coordinates
 * @param {Object} v2 - Second point with {x, y} coordinates  
 * @param {number} m - First ratio component
 * @param {number} n - Second ratio component
 * @returns {Object} Division point with {x, y} coordinates
 */
export function section(v1, v2, m, n) {
    return {
        x: (m * v1.x + n * v2.x) / (m + n),
        y: (m * v1.y + n * v2.y) / (m + n)
    };
}

/**
 * Generate sample points from a tiling edge using spiral transformation
 * Returns an array of spiral-transformed points along an edge
 * @param {Object} v1 - Start point with {x, y} coordinates
 * @param {Object} v2 - End point with {x, y} coordinates
 * @param {number} n - Number of divisions (creates n+1 points)
 * @returns {Array} Array of [x, y] coordinate pairs
 */
export function sample_edge(v1, v2, n) {
    let pts = [];
    for (let i = 0; i <= n; i++) {
        let p = spiral(section(v1, v2, n - i, i));
        pts.push([p.x, p.y]);
    }
    return pts;
}

/**
 * Linear interpolation between two values
 * Helper function for smooth transitions
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Linear interpolation between two points
 * @param {Object} p1 - Start point with {x, y} coordinates
 * @param {Object} p2 - End point with {x, y} coordinates
 * @param {number} t - Interpolation factor (0-1)
 * @returns {Object} Interpolated point with {x, y} coordinates
 */
export function lerpPoint(p1, p2, t) {
    return {
        x: lerp(p1.x, p2.x, t),
        y: lerp(p1.y, p2.y, t)
    };
}

export default { 
    spiral, 
    section, 
    sample_edge, 
    lerp, 
    lerpPoint 
};
