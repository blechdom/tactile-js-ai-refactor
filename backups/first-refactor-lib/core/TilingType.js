/**
 * TilingType Class
 * Represents a single isohedral tiling type with clean abstractions
 */

import { EdgeShape } from '../constants/EdgeShape.js';

export class TilingType {
    constructor(typeId, config) {
        this.id = typeId;
        this.name = `IH${typeId.toString().padStart(2, '0')}`;
        
        // Core properties
        this.numParams = config.num_params || 0;
        this.numAspects = config.num_aspects || 1;
        this.numVertices = config.num_vertices || 6;
        this.numEdgeShapes = config.num_edge_shapes || 3;
        
        // Edge information
        this.edgeShapes = config.edge_shapes || [];
        this.edgeShapeIds = config.edge_shape_ids || [];
        this.edgeOrientations = config.edge_orientations || [];
        
        // Parameters and coefficients
        this.defaultParams = config.default_params || [];
        this.vertexCoeffs = config.vertex_coeffs || [];
        this.translationCoeffs = config.translation_coeffs || [];
        this.aspectCoeffs = config.aspect_coeffs || [];
        this.coloring = config.coloring || [];
    }
    
    // Edge shape methods
    getEdgeShape(index) {
        return this.edgeShapes[index] || EdgeShape.J;
    }
    
    getEdgeShapeId(index) {
        return this.edgeShapeIds[index] || 0;
    }
    
    getEdgeOrientation(index) {
        return this.edgeOrientations[index] || false;
    }
    
    // Parameter methods
    getDefaultParams() {
        return [...this.defaultParams];
    }
    
    getParameterCount() {
        return this.numParams;
    }
    
    // Vertex methods
    getVertexCount() {
        return this.numVertices;
    }
    
    // Aspect methods
    getAspectCount() {
        return this.numAspects;
    }
    
    // Validation methods
    isValid() {
        return this.id > 0 && this.numVertices > 0;
    }
    
    // Utility methods
    hasEdgeShape(edgeShape) {
        return this.edgeShapes.includes(edgeShape);
    }
    
    getEdgeShapeCount(edgeShape) {
        return this.edgeShapes.filter(es => es === edgeShape).length;
    }
    
    // Serialization for debugging
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            numParams: this.numParams,
            numAspects: this.numAspects,
            numVertices: this.numVertices,
            numEdgeShapes: this.numEdgeShapes,
            edgeShapes: this.edgeShapes,
            isValid: this.isValid()
        };
    }
}

export default TilingType;
