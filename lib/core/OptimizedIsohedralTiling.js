/**
 * Optimized Isohedral Tiling
 * Memory-efficient version with lazy loading and data compression
 */

import { lazyLoader } from '../data/LazyTilingLoader.js';
import { mul, createPoint } from '../utils/MathUtils.js';
import { VALID_TILING_TYPES } from '../data/TilingData.js';
import { IsohedralTiling } from './IsohedralTiling.js';

export class OptimizedIsohedralTiling {
    constructor(type) {
        if (!VALID_TILING_TYPES.includes(type)) {
            throw new Error(`Invalid tiling type: ${type}. Valid types: ${VALID_TILING_TYPES.join(', ')}`);
        }

        this._type = type;
        this._definition = null;
        this._params = null;
        this._loaded = false;
        this._fallbackTiling = null; // Fallback to regular tiling when needed
    }

    /**
     * Lazy load the tiling definition
     */
    async _ensureLoaded() {
        if (!this._loaded) {
            this._definition = await lazyLoader.getTilingDefinition(this._type);
            this._params = [...this._definition.default_params];
            this._loaded = true;
        }
    }

    /**
     * Get tiling type
     */
    getTilingType() {
        return this._type;
    }

    /**
     * Get number of parameters (async)
     */
    async getNumParams() {
        await this._ensureLoaded();
        return this._definition.num_params;
    }

    /**
     * Get parameters
     */
    async getParams() {
        await this._ensureLoaded();
        return [...this._params];
    }

    /**
     * Set parameters with validation
     */
    async setParams(params) {
        await this._ensureLoaded();
        if (params.length !== this._definition.num_params) {
            throw new Error(`Expected ${this._definition.num_params} parameters, got ${params.length}`);
        }
        this._params = [...params];
    }

    /**
     * Get vertex positions (lazy-computed)
     */
    async getVertices() {
        await this._ensureLoaded();
        
        const vertices = [];
        const { vertex_coeffs, num_vertices } = this._definition;
        
        // Use cached vertices if parameters haven't changed
        if (!this._cachedVertices || this._paramsDirty) {
            this._cachedVertices = [];
            
            for (let i = 0; i < num_vertices; i++) {
                const vertex = this._makePoint(vertex_coeffs, i * (this._params.length * 2), this._params);
                this._cachedVertices.push(vertex);
            }
            this._paramsDirty = false;
        }
        
        return this._cachedVertices.map(v => ({ x: v.x, y: v.y }));
    }

    /**
     * Get shape boundary (optimized)
     */
    async getShape() {
        const vertices = await this.getVertices();
        return vertices; // Shape is just the vertices connected
    }

    /**
     * Check if point is inside tile (async)
     */
    async isInside(point) {
        const vertices = await this.getVertices();
        return this._pointInPolygon(point, vertices);
    }

    /**
     * Get fallback tiling for complex operations
     */
    _getFallbackTiling() {
        if (!this._fallbackTiling) {
            this._fallbackTiling = new IsohedralTiling(this._type);
            // If we have parameters, sync them to fallback
            if (this._params) {
                this._fallbackTiling.setParameters(this._params);
            }
        }
        return this._fallbackTiling;
    }

    /**
     * API Compatibility Methods (sync versions for backward compatibility)
     */
    getParameters() {
        return this._getFallbackTiling().getParameters();
    }

    setParameters(params) {
        // Clear fallback to force recreation with new params
        this._fallbackTiling = null;
        
        const result = this._getFallbackTiling().setParameters(params);
        // Sync our optimized params
        this._params = [...params];
        return result;
    }

    numEdgeShapes() {
        return this._getFallbackTiling().numEdgeShapes();
    }

    getEdgeShape(index) {
        return this._getFallbackTiling().getEdgeShape(index);
    }

    shape() {
        return this._getFallbackTiling().shape();
    }

    fillRegionBounds(...args) {
        return this._getFallbackTiling().fillRegionBounds(...args);
    }

    getColour(...args) {
        return this._getFallbackTiling().getColour(...args);
    }

    getT1() {
        return this._getFallbackTiling().getT1();
    }

    getT2() {
        return this._getFallbackTiling().getT2();
    }

    fillRegionQuad(...args) {
        return this._getFallbackTiling().fillRegionQuad(...args);
    }

    getVertex(...args) {
        return this._getFallbackTiling().getVertex(...args);
    }

    parts() {
        return this._getFallbackTiling().parts();
    }

    vertices() {
        return this._getFallbackTiling().vertices();
    }

    reset(...args) {
        this._fallbackTiling = null; // Force recreation with new data
        return this._getFallbackTiling().reset(...args);
    }

    // Additional commonly used methods
    numVertices() {
        return this._getFallbackTiling().numVertices();
    }

    numAspects() {
        return this._getFallbackTiling().numAspects();
    }

    numParameters() {
        return this._getFallbackTiling().numParameters();
    }

    /**
     * Get memory usage statistics
     */
    getMemoryStats() {
        return {
            type: this._type,
            loaded: this._loaded,
            cachedVertices: this._cachedVertices ? this._cachedVertices.length : 0,
            parameterCount: this._params ? this._params.length : 0
        };
    }

    /**
     * Free cached data to reduce memory usage
     */
    cleanup() {
        this._cachedVertices = null;
        this._paramsDirty = true;
    }

    // Private methods
    _makePoint(coeffs, offs, params) {
        let ret = { x: 0.0, y: 0.0 };

        for (let i = 0; i < params.length; ++i) {
            ret.x += coeffs[offs + i] * params[i];
            ret.y += coeffs[offs + params.length + i] * params[i];
        }

        return ret;
    }

    _pointInPolygon(point, vertices) {
        let inside = false;
        const { x, y } = point;
        
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const xi = vertices[i].x, yi = vertices[i].y;
            const xj = vertices[j].x, yj = vertices[j].y;
            
            if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        
        return inside;
    }

    /**
     * Static method to preload common types
     */
    static async preloadCommon() {
        await lazyLoader.preloadCommon();
    }

    /**
     * Static method to get cache statistics
     */
    static getCacheStats() {
        return lazyLoader.getCacheStats();
    }
}

export default OptimizedIsohedralTiling;
