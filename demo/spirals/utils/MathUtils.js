/*
 * Spiral Demo Mathematical Utilities
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

// =============================================================================
// Vector Operations
// =============================================================================

/**
 * Vector subtraction
 * @param {Object} V - First vector with x,y properties  
 * @param {Object} W - Second vector with x,y properties
 * @returns {Object} Result vector with x,y properties
 */
export function sub(V, W) { 
    return { x: V.x - W.x, y: V.y - W.y }; 
}

/**
 * Vector dot product
 * @param {Object} V - First vector with x,y properties
 * @param {Object} W - Second vector with x,y properties  
 * @returns {number} Dot product result
 */
export function dot(V, W) { 
    return V.x * W.x + V.y * W.y; 
}

/**
 * Vector length/magnitude
 * @param {Object} V - Vector with x,y properties
 * @returns {number} Length of the vector
 */
export function len(V) { 
    return Math.sqrt(dot(V, V)); 
}

/**
 * Distance between two points
 * @param {Object} V - First point with x,y properties
 * @param {Object} W - Second point with x,y properties
 * @returns {number} Distance between points
 */
export function ptdist(V, W) { 
    return len(sub(V, W)); 
}

/**
 * Vector normalization (unit vector)
 * @param {Object} V - Vector with x,y properties
 * @returns {Object} Normalized vector with x,y properties
 */
export function normalize(V) {
    const l = len(V);
    return { x: V.x / l, y: V.y / l };
}

/**
 * Vector scaling
 * @param {Object} v - Vector with x,y properties
 * @param {number} a - Scale factor
 * @returns {Object} Scaled vector with x,y properties
 */
export function scaleVec(v, a) {
    return { x: v.x * a, y: v.y * a };
}

// =============================================================================
// Matrix Operations
// =============================================================================

/**
 * Matrix inversion for 2D transformation matrices
 * @param {Array} T - 6-element transformation matrix [a,b,c,d,e,f]
 * @returns {Array} Inverted transformation matrix
 */
export function inv(T) {
    const det = T[0] * T[4] - T[1] * T[3];
    return [
        T[4] / det, 
        -T[1] / det, 
        (T[1] * T[5] - T[2] * T[4]) / det,
        -T[3] / det, 
        T[0] / det, 
        (T[2] * T[3] - T[0] * T[5]) / det
    ];
}

// =============================================================================
// Geometric Utilities
// =============================================================================

/**
 * Calculate distance from a point to a line segment
 * @param {Object} P - Point with x,y properties
 * @param {Object} A - Line segment start point with x,y properties
 * @param {Object} B - Line segment end point with x,y properties
 * @returns {number} Distance from point to line segment
 */
export function distToSeg(P, A, B) {
    const qmp = sub(B, A);
    const t = dot(sub(P, A), qmp) / dot(qmp, qmp);
    if ((t >= 0.0) && (t <= 1.0)) {
        return len(sub(P, { x: A.x + t * qmp.x, y: A.y + t * qmp.y }));
    } else if (t < 0.0) {
        return ptdist(P, A);
    } else {
        return ptdist(P, B);
    }
}

export default {
    // Vector operations
    sub, dot, len, ptdist, normalize, scaleVec,
    // Matrix operations  
    inv,
    // Geometric utilities
    distToSeg
};
