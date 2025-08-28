/*
 * GeometryUtils.js - Shared geometry utilities for Tactile.js demos
 * Eliminates duplicate geometric calculation code across demos
 */

'use strict';

// makeBox function moved to lib/utils/UIUtils.js to eliminate duplication

// Test if point (x,y) hits box B
export function hitBox(x, y, B) {
    return (x >= B.x) && (x <= (B.x + B.w)) && (y >= B.y) && (y <= (B.y + B.h));
}

// distToSeg function moved to lib/utils/MathUtils.js to eliminate duplication

// Calculate bounds of a set of points
export function calculateBounds(points) {
    if (points.length === 0) {
        return { xmin: 0, xmax: 0, ymin: 0, ymax: 0 };
    }
    
    let xmin = points[0].x;
    let xmax = points[0].x;
    let ymin = points[0].y;
    let ymax = points[0].y;
    
    for (let i = 1; i < points.length; i++) {
        const p = points[i];
        if (p.x < xmin) xmin = p.x;
        if (p.x > xmax) xmax = p.x;
        if (p.y < ymin) ymin = p.y;
        if (p.y > ymax) ymax = p.y;
    }
    
    return { xmin, xmax, ymin, ymax };
}

// Calculate center point of a set of points
export function calculateCenter(points) {
    if (points.length === 0) {
        return { x: 0, y: 0 };
    }
    
    let totalX = 0;
    let totalY = 0;
    for (const p of points) {
        totalX += p.x;
        totalY += p.y;
    }
    
    return {
        x: totalX / points.length,
        y: totalY / points.length
    };
}

