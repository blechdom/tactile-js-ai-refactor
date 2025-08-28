/**
 * TilingType
 * Simple container for tiling type configuration data
 */

export class TilingType {
    constructor(typeId, config) {
        this.typeId = typeId;
        this.numParams = config.numParams;
        this.numAspects = config.numAspects; 
        this.numVertices = config.numVertices;
        this.numEdgeShapes = config.numEdgeShapes;
        this.edgeShapes = config.edgeShapes;
        this.edgeOrientations = config.edgeOrientations;
        this.edgeShapeIds = config.edgeShapeIds;
        this.defaultParams = config.defaultParams;
        this.vertexCoeffs = config.vertexCoeffs;
        this.translationCoeffs = config.translationCoeffs;
        this.aspectCoeffs = config.aspectCoeffs;
        this.coloring = config.coloring;
    }

    getId() {
        return this.typeId;
    }

    getNumParams() {
        return this.numParams;
    }

    getNumAspects() {
        return this.numAspects;
    }

    getNumVertices() {
        return this.numVertices;
    }

    getNumEdgeShapes() {
        return this.numEdgeShapes;
    }

    getEdgeShapes() {
        return this.edgeShapes;
    }

    getDefaultParams() {
        return [...this.defaultParams];
    }
}

export default TilingType;
