/*
 * MathUtils.js - Shared mathematical utilities for Tactile.js demos
 * Eliminates duplicate vector and matrix math code across demos
 */

'use strict';

// Vector operations
export function sub(V, W) { 
    return { x: V.x - W.x, y: V.y - W.y }; 
}

export function dot(V, W) { 
    return V.x * W.x + V.y * W.y; 
}

export function len(V) { 
    return Math.sqrt(dot(V, V)); 
}

export function normalize(V) {
    const l = len(V);
    return { x: V.x / l, y: V.y / l };
}

export function ptdist(V, W) { 
    return len(sub(V, W)); 
}

// 2D affine matrix inverse
export function inv(T) {
    const det = T[0] * T[4] - T[1] * T[3];
    return [
        T[4] / det, -T[1] / det, (T[1] * T[5] - T[2] * T[4]) / det,
        -T[3] / det, T[0] / det, (T[2] * T[3] - T[0] * T[5]) / det
    ];
}

