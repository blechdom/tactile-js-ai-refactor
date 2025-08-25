/*
 * GeometryUtils.js - Shared geometry utilities for Tactile.js demos
 * Eliminates duplicate geometric calculation code across demos
 */

'use strict';

// Create a rectangular box/bounds object
export function makeBox(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}

// Test if point (x,y) hits box B
export function hitBox(x, y, B) {
    return (x >= B.x) && (x <= (B.x + B.w)) && (y >= B.y) && (y <= (B.y + B.h));
}

// Calculate distance from point P to line segment AB
export function distToSeg(P, A, B) {
    const qmp = { x: B.x - A.x, y: B.y - A.y };
    const t = ((P.x - A.x) * qmp.x + (P.y - A.y) * qmp.y) / (qmp.x * qmp.x + qmp.y * qmp.y);
    if ((t >= 0.0) && (t <= 1.0)) {
        const proj = { x: A.x + t * qmp.x, y: A.y + t * qmp.y };
        const diff = { x: P.x - proj.x, y: P.y - proj.y };
        return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
    } else if (t < 0.0) {
        const diff = { x: P.x - A.x, y: P.y - A.y };
        return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
    } else {
        const diff = { x: P.x - B.x, y: P.y - B.y };
        return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
    }
}

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

