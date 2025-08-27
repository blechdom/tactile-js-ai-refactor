/*
 * Spiral Demo Event Handlers
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

/**
 * Simple event handler functions
 * These will be used directly by the spiral demo
 */

/**
 * Handle help button click - opens help documentation
 */
export function doHelp() {
    window.open("https://isohedral.ca");
}

/**
 * Toggle fullscreen mode helper - to be used with closure variables
 * @param {boolean} fullscreen - Current fullscreen state (will be modified)
 * @param {Array} uiElements - Array of UI elements to show/hide
 * @param {Object} p5c - p5.js instance
 */
export function toggleFullscreenLogic(fullscreen, uiElements, p5c) {
    const newFullscreenState = !fullscreen;
    
    // Hide or show elements based on fullscreen state
    for (let elt of uiElements) {
        if (elt != null) {
            if (newFullscreenState) {
                elt.hide();
            } else {
                elt.show();
            }
        }
    }

    p5c.loop();
    return newFullscreenState;
}

/**
 * Toggle color mode helper
 * @param {boolean} colour - Current color state (will be modified)
 * @param {Function} drawTranslationalUnit - Function to redraw with new color mode
 * @param {Object} p5c - p5.js instance
 */
export function toggleColourLogic(colour, drawTranslationalUnit, p5c) {
    const newColourState = !colour;
    
    // Redraw the translational unit with new color mode
    drawTranslationalUnit();
    p5c.loop();
    
    return newColourState;
}

/**
 * Toggle animation helper
 * @param {boolean} animating - Current animation state (will be modified) 
 * @param {Object} p5c - p5.js instance
 */
export function toggleAnimationLogic(animating, p5c) {
    const newAnimatingState = !animating;
    
    if (newAnimatingState) {
        p5c.loop();
    }
    
    return newAnimatingState;
}

/**
 * Save spiral as SVG helper
 * @param {Function} getSpiralTilingSVG - Function to generate the spiral SVG
 * @param {Object} p5c - p5.js instance
 */
export function doSaveLogic(getSpiralTilingSVG, p5c) {
    // Helper function to serialize SVG to string
    const getSvgFile = (s, svg) =>
        s.serializeToString(svg).split('\n');

    // Generate the spiral tiling SVG
    const svg = getSpiralTilingSVG();
    const svgFile = getSvgFile(new XMLSerializer(), svg);
    
    // Save using p5.js save function
    p5c.save(svgFile, "spiral", "svg");
}

export default { 
    doHelp, 
    toggleFullscreenLogic, 
    toggleColourLogic, 
    toggleAnimationLogic, 
    doSaveLogic 
};
