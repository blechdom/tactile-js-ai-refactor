/*
 * Spiral Demo Constants
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

// =============================================================================
// Mode Constants
// =============================================================================
export const MODES = {
    NONE: 9000,
    MOVE_VERTEX: 9001,
    ADJ_TILE: 9002,
    ADJ_TV: 9003,
    ADJ_TILING: 9004
};

// =============================================================================
// Default Values
// =============================================================================
export const SPIRAL_DEFAULTS = {
    A: 1,
    B: 5,
    TILING_V: { x: 0.0, y: 0.0 }
};

// =============================================================================
// Graphics and Rendering Constants
// =============================================================================
export const GRAPHICS = {
    FBO_DIM: 256,
    PHYS_UNIT: 60, // Ideally, about a centimeter
    INITIAL_HEIGHT_SCALE: 6.0
};

// =============================================================================
// UI and Touch Constants
// =============================================================================
export const UI = {
    MAX_TOUCHES: 1,
    FAKE_SERIAL: 123456,
    SLIDER_Y_START: 50,
    SLIDER_Y_INCREMENT: 30,
    SLIDER_X_OFFSET: 20,
    SLIDER_WIDTH_OFFSET: 100,
    SLIDER_MIN: 0.0,
    SLIDER_MAX: 500.0,
    SLIDER_SCALE: 250.0
};

// =============================================================================
// Initial State Flags
// =============================================================================
export const INITIAL_STATE = {
    ANIMATING: false,
    FULLSCREEN: false,
    COLOUR: false,
    DEBUG: true,
    U_CONSTRAIN: false,
    DO_MOBIUS: false
};

// =============================================================================
// Color Palette
// =============================================================================
export const COLS = [
    [25, 52, 65],
    [62, 96, 111],
    [145, 170, 157],
    [209, 219, 189],
    [252, 255, 245],
    [219, 188, 209]
];

// =============================================================================
// SVG Constants
// =============================================================================
export const SVG_CONSTANTS = {
    XMLNS: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink"
};

// =============================================================================
// Tiling Type Constants
// =============================================================================
export const TILING_PARAMS = {
    MIN_TYPE: 0,
    MAX_TYPE: 80,
    DEFAULT_TYPE: 0,
    STEP: 1
};

// =============================================================================
// Slider Configuration
// =============================================================================
export const SLIDER_CONFIG = {
    SPIRAL_A: {
        MIN: 0,
        MAX: 20,
        DEFAULT: 1,
        STEP: 1
    },
    SPIRAL_B: {
        MIN: 0,
        MAX: 20,
        DEFAULT: 5,
        STEP: 1
    },
    TILING_TYPE: {
        MIN: 0,
        MAX: 80,
        DEFAULT: 0,
        STEP: 1
    }
};

// =============================================================================
// Button Sizes and Positions
// =============================================================================
export const BUTTON_CONFIG = {
    SIZE: {
        WIDTH: 90,
        HEIGHT: 30
    },
    POSITIONS: {
        X: 10,
        HELP_Y: 130,
        FULLSCREEN_Y: 10,
        COLOUR_Y: 50,
        ANIMATE_Y: 90,
        SAVE_Y: 170
    }
};
