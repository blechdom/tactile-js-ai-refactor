/**
 * Shared Constants for Tactile.js Demos
 * Contains all magic numbers and frequently used values
 */

// Physical dimensions
export const PHYSICAL_UNIT = 60; // Base unit for UI elements (ideally ~1cm)

// Canvas dimensions
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;

// Color values
export const RGB_MAX = 255;
export const ALPHA_MAX = 255;
export const WHITE_RGB = [255, 255, 255];
export const BLACK_RGB = [0, 0, 0];

// Animation and interaction
export const ANIMATION_SPEED = 0.05;
export const PARAMETER_VARIATION = 0.3;
export const PARAMETER_VARIATION_HALF = 0.15; // PARAMETER_VARIATION / 2
export const STROKE_WEIGHT_THIN = 0.5;

// Curve generation constraints
export const CURVE_X_MIN = 0.1;
export const CURVE_X_MAX = 0.5; 
export const CURVE_Y_RANGE = 0.1; // ±0.1 for Y values
export const BEZIER_CURVE_RANGE = 0.6;

// Scaling limits
export const MIN_SCALE = 4.0;
export const MAX_SCALE = 12.0;
export const SCALE_RANGE = MAX_SCALE - MIN_SCALE; // 8.0

// Canvas utilization
export const MIN_POSITION = 0.15;
export const MAX_POSITION = 0.85;
export const POSITION_RANGE = MAX_POSITION - MIN_POSITION; // 0.7

// Common fractions
export const HALF = 0.5;
export const QUARTER = 0.25;
export const THREE_QUARTERS = 0.75;
export const EIGHTH = 0.125;

// Default UI colors (commonly used across demos)
export const UI_BACKGROUND = [252, 255, 254, 220];
export const UI_STROKE = [0, 0, 0];
export const UI_FILL_LIGHT = [252, 255, 245];

// HSB color wheel
export const HSB_HUE_MAX = 360;
export const HSB_SATURATION_DEFAULT = 80;
export const HSB_BRIGHTNESS_DEFAULT = 90;
export const HSB_SATURATION_MAX = 100;
export const HSB_BRIGHTNESS_MAX = 100;
