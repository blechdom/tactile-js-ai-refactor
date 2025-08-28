/*
 * Spiral Demo Touch Data Management
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

import { UI } from '../constants/SpiralConstants.js';

/**
 * Manages touch/mouse interaction data and state
 * Handles multi-touch tracking and touch event data
 */
export class TouchDataManager {
    constructor() {
        this.fake_serial = UI.FAKE_SERIAL;
        this.all_touch_ids = [];
        this.my_touches = {};
        this.num_touches = 0;
        this.max_touches = UI.MAX_TOUCHES;
    }

    /**
     * Add a new touch point
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number|string} id - Touch identifier
     * @returns {boolean} True if touch was added, false if max touches reached
     */
    addTouch(x, y, id) {
        if (this.num_touches < this.max_touches) {
            this.my_touches[id] = {
                down: { x: x, y: y },
                prev: { x: x, y: y },
                pos: { x: x, y: y },
                present: true
            };
            ++this.num_touches;
            return true;
        }
        return false;
    }

    /**
     * Remove a touch point
     * @param {number|string} id - Touch identifier
     * @returns {boolean} True if touch was removed
     */
    removeTouch(id) {
        if (id in this.my_touches) {
            delete this.my_touches[id];
            --this.num_touches;
            return true;
        }
        return false;
    }

    /**
     * Update touch position
     * @param {number|string} id - Touch identifier
     * @param {number} x - New X coordinate
     * @param {number} y - New Y coordinate
     * @returns {boolean} True if touch was updated
     */
    updateTouchPosition(id, x, y) {
        if (id in this.my_touches) {
            const touch = this.my_touches[id];
            touch.prev = touch.pos;
            touch.pos = { x: x, y: y };
            return true;
        }
        return false;
    }

    /**
     * Mark touch as present for this frame
     * @param {number|string} id - Touch identifier
     */
    markTouchPresent(id) {
        if (id in this.my_touches) {
            this.my_touches[id].present = true;
        }
    }

    /**
     * Mark touch as not present for this frame
     * @param {number|string} id - Touch identifier
     */
    markTouchNotPresent(id) {
        if (id in this.my_touches) {
            this.my_touches[id].present = false;
        }
    }

    /**
     * Get all current touch IDs
     * @returns {Array} Array of touch IDs
     */
    getTouchIds() {
        return Object.keys(this.my_touches);
    }

    /**
     * Get touch data by ID
     * @param {number|string} id - Touch identifier
     * @returns {Object|null} Touch data or null if not found
     */
    getTouch(id) {
        return this.my_touches[id] || null;
    }

    /**
     * Clear all touches
     */
    clearTouches() {
        this.my_touches = {};
        this.num_touches = 0;
        this.all_touch_ids = [];
    }

    /**
     * Clean up touches that are no longer present
     * @returns {Array} Array of removed touch IDs
     */
    cleanupTouches() {
        const removedIds = [];
        for (let k in this.my_touches) {
            if (!this.my_touches[k].present) {
                removedIds.push(k);
                delete this.my_touches[k];
                --this.num_touches;
            }
        }
        return removedIds;
    }

    /**
     * Set maximum number of concurrent touches
     * @param {number} max - Maximum touches
     */
    setMaxTouches(max) {
        this.max_touches = max;
    }

    /**
     * Get current number of active touches
     * @returns {number} Number of active touches
     */
    getNumTouches() {
        return this.num_touches;
    }

    /**
     * Check if at maximum touch capacity
     * @returns {boolean} True if at max capacity
     */
    isAtMaxTouches() {
        return this.num_touches >= this.max_touches;
    }
}

export default TouchDataManager;
