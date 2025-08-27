/*
 * Spiral Demo State Data Management
 * Copyright 2019 Craig S. Kaplan, csk@uwaterloo.ca
 * Distributed under the terms of the 3-clause BSD license.
 */

'use strict';

import { INITIAL_STATE } from '../constants/SpiralConstants.js';

/**
 * Manages application state data and debug information
 * Handles debug messages, state flags, and other global state
 */
export class StateDataManager {
    constructor() {
        this.msgs = [];
        this.DEBUG = INITIAL_STATE.DEBUG;
        this.maxMessages = 50; // Prevent memory leaks from too many messages
    }

    /**
     * Add a debug message
     * @param {string} message - Debug message to add
     */
    addDebugMessage(message) {
        if (this.DEBUG) {
            this.msgs.push(message);
            
            // Keep only the most recent messages
            if (this.msgs.length > this.maxMessages) {
                this.msgs.shift();
            }
        }
    }

    /**
     * Get recent debug messages for display
     * @param {number} count - Number of recent messages to return (default: 10)
     * @returns {Array} Array of recent debug messages
     */
    getRecentMessages(count = 10) {
        const startIndex = Math.max(0, this.msgs.length - count);
        return this.msgs.slice(startIndex);
    }

    /**
     * Clear all debug messages
     */
    clearMessages() {
        this.msgs = [];
    }

    /**
     * Enable or disable debug mode
     * @param {boolean} enabled - True to enable debug mode
     */
    setDebugMode(enabled) {
        this.DEBUG = enabled;
        if (!enabled) {
            this.clearMessages();
        }
    }

    /**
     * Check if debug mode is enabled
     * @returns {boolean} True if debug mode is enabled
     */
    isDebugMode() {
        return this.DEBUG;
    }

    /**
     * Get total number of debug messages
     * @returns {number} Total message count
     */
    getMessageCount() {
        return this.msgs.length;
    }

    /**
     * Set maximum number of messages to keep
     * @param {number} max - Maximum messages to keep
     */
    setMaxMessages(max) {
        this.maxMessages = Math.max(1, max);
        
        // Trim existing messages if needed
        if (this.msgs.length > this.maxMessages) {
            this.msgs = this.msgs.slice(-this.maxMessages);
        }
    }

    /**
     * Get all debug messages
     * @returns {Array} All debug messages
     */
    getAllMessages() {
        return [...this.msgs];
    }
}

export default StateDataManager;
