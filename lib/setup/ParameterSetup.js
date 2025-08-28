/*
 * Spiral Demo Parameter Setup Functions
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

/**
 * Setup functions that handle parameter changes from UI controls
 * These functions respond to slider and input changes
 */

/**
 * Handle parameter changes from tiling parameter sliders
 * @param {Array} tv_sliders - Array of parameter sliders
 * @param {Object} tiling - The tiling object to update
 * @param {Function} cacheTileShape - Function to cache the updated tile shape
 * @param {Object} p5c - p5.js instance for loop control
 */
export function handleParameterChanged(tv_sliders, tiling, cacheTileShape, p5c) {
    if (tv_sliders != null) {
        const params = tv_sliders.map(sl => sl.value() / 250.0);
        tiling.setParameters(params);
        cacheTileShape();
        p5c.loop();
    }
}

/**
 * Handle tiling type changes from the tiling type slider
 * @param {Object} ih_slider - The isohedral type slider
 * @param {Object} ih_label - The isohedral type label to update
 * @param {Array} tilingTypes - Array of available tiling types
 * @param {Function} setTilingType - Function to apply the new tiling type
 * @param {Object} p5c - p5.js instance for loop control
 * @returns {number} The new tiling type index
 */
export function handleTilingTypeChanged(ih_slider, ih_label, tilingTypes, setTilingType, p5c) {
    const the_type = p5c.int(ih_slider.value());
    const tt = tilingTypes[the_type];
    const name = ((tt < 10) ? "IH0" : "IH") + tt;
    ih_label.html(name);

    setTilingType();
    p5c.loop();
    
    return the_type;
}

/**
 * Handle spiral parameter changes from A and B sliders
 * @param {Object} A_slider - The spiral A parameter slider
 * @param {Object} A_label - The spiral A parameter label to update
 * @param {Object} B_slider - The spiral B parameter slider  
 * @param {Object} B_label - The spiral B parameter label to update
 * @param {Function} calculateTilingTransform - Function to recalculate transform
 * @param {Object} p5c - p5.js instance for loop control
 * @returns {Object} Object with {spiral_A, spiral_B} values
 */
export function handleSpiralChanged(A_slider, A_label, B_slider, B_label, calculateTilingTransform, p5c) {
    const spiral_A = p5c.int(A_slider.value());
    const spiral_B = p5c.int(B_slider.value());
    
    calculateTilingTransform();

    A_label.html("A: " + spiral_A);
    B_label.html("B: " + spiral_B);

    p5c.loop();
    
    return { spiral_A, spiral_B };
}

export default { 
    handleParameterChanged, 
    handleTilingTypeChanged, 
    handleSpiralChanged 
};
