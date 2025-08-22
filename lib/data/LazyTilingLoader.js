/**
 * Lazy Tiling Data Loader
 * Loads tiling definitions on-demand to reduce initial bundle size
 */

import { VALID_TILING_TYPES } from './TilingData.js';

export class LazyTilingLoader {
    constructor() {
        this.cache = new Map();
        this.loadPromises = new Map();
    }

    /**
     * Get a tiling definition by type, loading it lazily
     */
    async getTilingDefinition(type) {
        // Check cache first
        if (this.cache.has(type)) {
            return this.cache.get(type);
        }

        // Check if already loading
        if (this.loadPromises.has(type)) {
            return this.loadPromises.get(type);
        }

        // Validate type
        if (!VALID_TILING_TYPES.includes(type)) {
            throw new Error(`Invalid tiling type: ${type}`);
        }

        // Load the definition
        const loadPromise = this._loadTilingDefinition(type);
        this.loadPromises.set(type, loadPromise);

        try {
            const definition = await loadPromise;
            this.cache.set(type, definition);
            this.loadPromises.delete(type);
            return definition;
        } catch (error) {
            this.loadPromises.delete(type);
            throw error;
        }
    }

    /**
     * Preload commonly used tiling types
     */
    async preloadCommon() {
        const commonTypes = [1, 8, 10, 18, 62]; // Most basic/commonly used
        await Promise.all(commonTypes.map(type => this.getTilingDefinition(type)));
    }

    /**
     * Preload a range of tiling types
     */
    async preloadRange(start, end) {
        const types = VALID_TILING_TYPES.filter(t => t >= start && t <= end);
        await Promise.all(types.map(type => this.getTilingDefinition(type)));
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            cached: this.cache.size,
            loading: this.loadPromises.size,
            total: VALID_TILING_TYPES.length,
            hitRate: this.cache.size / VALID_TILING_TYPES.length
        };
    }

    /**
     * Clear cache to free memory
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Internal method to load tiling definition
     * This would be overridden to implement actual lazy loading
     */
    async _loadTilingDefinition(type) {
        // For now, load from the main data file
        // In a full implementation, this would load individual chunks
        const { TILING_TYPE_DEFINITIONS } = await import('./TilingData.js');
        return TILING_TYPE_DEFINITIONS[type];
    }
}

// Global lazy loader instance
export const lazyLoader = new LazyTilingLoader();

export default LazyTilingLoader;
