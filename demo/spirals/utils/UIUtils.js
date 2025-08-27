/*
 * Spiral Demo UI Utilities
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

// =============================================================================
// Bounding Box Utilities
// =============================================================================

/**
 * Create a bounding box object
 * @param {number} x - X coordinate of top-left corner
 * @param {number} y - Y coordinate of top-left corner  
 * @param {number} w - Width of the box
 * @param {number} h - Height of the box
 * @returns {Object} Bounding box object with x, y, w, h properties
 */
export function makeBox(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}

/**
 * Test if a point is inside a bounding box
 * @param {number} x - X coordinate of the point
 * @param {number} y - Y coordinate of the point
 * @param {Object} B - Bounding box object with x, y, w, h properties
 * @returns {boolean} True if point is inside the box
 */
export function hitBox(x, y, B) {
    return (x >= B.x) && (x <= (B.x + B.w)) && (y >= B.y) && (y <= (B.y + B.h));
}

// =============================================================================
// UI Styling Utilities
// =============================================================================

/**
 * Apply standard styling to a p5.js UI label
 * @param {Object} lab - p5.js UI element to style
 */
export function setLabelStyle(lab) {
    lab.style("font-family", "sans-serif");
    lab.style("font-size", "16px"); // Reduced from 24px to 16px
    lab.style("font-weight", "bold");
    lab.style("text-align", "center");
}

// =============================================================================
// Helper Functions for UI Layout
// =============================================================================

/**
 * Calculate center position for an element within a container
 * @param {number} containerSize - Size of the container (width or height)
 * @param {number} elementSize - Size of the element (width or height)
 * @returns {number} Position to center the element
 */
export function centerInContainer(containerSize, elementSize) {
    return (containerSize - elementSize) / 2;
}

/**
 * Clamp a value within a range
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export default {
    // Bounding box utilities
    makeBox, hitBox,
    // UI styling
    setLabelStyle,
    // Helper functions
    centerInContainer, clamp, lerp
};
