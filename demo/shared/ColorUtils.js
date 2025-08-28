/*
 * ColorUtils.js - Shared color utilities for Tactile.js demos
 * Eliminates duplicate color generation and management code across demos
 */

'use strict';

// Default color palette is now imported from lib/constants/SpiralConstants.js as COLS
import { COLS as DEFAULT_COLORS } from '../../lib/constants/SpiralConstants.js';
export { DEFAULT_COLORS };

// Generate random color palette
export function generateRandomColors(numColors = 6) {
    let cols = [];
    for (let i = 0; i < numColors; ++i) {
        cols.push([
            Math.floor(Math.random() * 255.0), 
            Math.floor(Math.random() * 255.0), 
            Math.floor(Math.random() * 255.0)
        ]);
    }
    return cols;
}

// Create a randomization callback function
export function createRandomizeColorsCallback(colorArray, refreshCallback) {
    return function() {
        const newColors = generateRandomColors(colorArray.length);
        for (let i = 0; i < colorArray.length && i < newColors.length; i++) {
            colorArray[i] = newColors[i];
        }
        if (refreshCallback) refreshCallback();
    };
}

// Apply random color to existing array (mutates original)
export function randomizeColors(colorArray) {
    const newColors = generateRandomColors(colorArray.length);
    for (let i = 0; i < colorArray.length && i < newColors.length; i++) {
        colorArray[i] = newColors[i];
    }
    return colorArray;
}

// Color interpolation
export function lerpColor(color1, color2, t) {
    return [
        Math.round(color1[0] + (color2[0] - color1[0]) * t),
        Math.round(color1[1] + (color2[1] - color1[1]) * t),
        Math.round(color1[2] + (color2[2] - color1[2]) * t)
    ];
}

