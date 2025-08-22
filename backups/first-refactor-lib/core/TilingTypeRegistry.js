/**
 * TilingTypeRegistry
 * Manages all tiling types with proper abstractions and lazy loading
 */

import { TilingType } from './TilingType.js';
import { tilingTypes } from '../constants/TilingTypes.js';

export class TilingTypeRegistry {
    constructor() {
        this.types = new Map();
        this.initialized = false;
    }
    
    // Initialize the registry with all tiling types
    async initialize() {
        if (this.initialized) return;
        
        // Load tiling type data dynamically
        await this.loadTilingTypeData();
        this.initialized = true;
    }
    
    // Get a specific tiling type
    getTilingType(typeId) {
        if (!this.types.has(typeId)) {
            throw new Error(`Tiling type ${typeId} not found`);
        }
        return this.types.get(typeId);
    }
    
    // Get all valid tiling types
    getAllTilingTypes() {
        return Array.from(this.types.values()).filter(type => type.isValid());
    }
    
    // Get tiling types by criteria
    getTilingTypesByEdgeShape(edgeShape) {
        return this.getAllTilingTypes().filter(type => 
            type.hasEdgeShape(edgeShape)
        );
    }
    
    getTilingTypesByParameterCount(paramCount) {
        return this.getAllTilingTypes().filter(type => 
            type.getParameterCount() === paramCount
        );
    }
    
    getTilingTypesByVertexCount(vertexCount) {
        return this.getAllTilingTypes().filter(type => 
            type.getVertexCount() === vertexCount
        );
    }
    
    // Validation methods
    isValidTilingType(typeId) {
        return this.types.has(typeId) && this.types.get(typeId).isValid();
    }
    
    // Statistics
    getStatistics() {
        const allTypes = this.getAllTilingTypes();
        return {
            totalTypes: allTypes.length,
            byParameterCount: this.groupBy(allTypes, 'numParams'),
            byVertexCount: this.groupBy(allTypes, 'numVertices'),
            byEdgeShape: this.getEdgeShapeDistribution(allTypes)
        };
    }
    
    // Helper methods
    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const value = item[key];
            groups[value] = groups[value] || [];
            groups[value].push(item);
            return groups;
        }, {});
    }
    
    getEdgeShapeDistribution(types) {
        const distribution = {};
        types.forEach(type => {
            type.edgeShapes.forEach(edgeShape => {
                distribution[edgeShape] = (distribution[edgeShape] || 0) + 1;
            });
        });
        return distribution;
    }
    
    // Load tiling type data (this will be implemented with the actual data)
    async loadTilingTypeData() {
        // For now, we'll create a minimal set of tiling types
        // This will be expanded as we extract more data
        const sampleData = {
            1: {
                num_params: 4,
                num_aspects: 1,
                num_vertices: 6,
                num_edge_shapes: 3,
                edge_shapes: [10001, 10001, 10001],
                edge_shape_ids: [0, 1, 2, 0, 1, 2],
                edge_orientations: [false, false, false, false, false, false, false, true, false, true, false, true],
                default_params: [0.12239750492, 0.5, 0.143395479017, 0.625],
                vertex_coeffs: [], // Will be filled in
                translation_coeffs: [], // Will be filled in
                aspect_coeffs: [], // Will be filled in
                coloring: [] // Will be filled in
            }
        };
        
        // Create TilingType instances
        Object.entries(sampleData).forEach(([id, config]) => {
            const typeId = parseInt(id);
            this.types.set(typeId, new TilingType(typeId, config));
        });
    }
}

export default TilingTypeRegistry;
