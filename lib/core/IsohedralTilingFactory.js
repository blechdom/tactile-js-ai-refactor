/**
 * IsohedralTilingFactory
 * Factory class to create IsohedralTiling instances with proper async initialization
 */

import { IsohedralTiling } from './IsohedralTiling.js';
import { TilingDataLoader } from '../data/TilingDataLoader.js';

export class IsohedralTilingFactory {
    constructor() {
        this.dataLoader = null;
        this.initialized = false;
    }

    initialize() {
        if (!this.initialized) {
            this.dataLoader = new TilingDataLoader();
            this.dataLoader.initialize();
            this.initialized = true;
        }
    }

    createTiling(tilingType) {
        if (!this.initialized) {
            this.initialize();
        }

        const tiling = new IsohedralTiling(tilingType);
        tiling.dataLoader = this.dataLoader;
        
        // Get the tiling type data
        tiling.tilingTypeData = this.dataLoader.getTilingType(tilingType);
        
        if (!tiling.tilingTypeData) {
            throw new Error(`Tiling type ${tilingType} is not defined in the library.`);
        }

        // Set up the data structure
        tiling.tiling_type = tilingType;
        tiling.ttd = {
            num_params: tiling.tilingTypeData.getParameterCount(),
            num_aspects: tiling.tilingTypeData.getAspectCount(),
            num_vertices: tiling.tilingTypeData.getVertexCount(),
            num_edge_shapes: tiling.tilingTypeData.getEdgeShapeCount(),
            edge_shapes: tiling.tilingTypeData.edgeShapes,
            edge_shape_ids: tiling.tilingTypeData.edgeShapeIds,
            edge_orientations: tiling.tilingTypeData.edgeOrientations,
            default_params: tiling.tilingTypeData.getDefaultParams(),
            vertex_coeffs: tiling.tilingTypeData.vertexCoeffs,
            translation_coeffs: tiling.tilingTypeData.translationCoeffs,
            aspect_coeffs: tiling.tilingTypeData.aspectCoeffs,
            colouring: tiling.tilingTypeData.coloring
        };

        tiling.parameters = tiling.ttd.default_params.slice(0);
        tiling.parameters.push(1.0);
        tiling.recompute();

        return tiling;
    }

    getAvailableTypes() {
        if (!this.initialized) {
            throw new Error('Factory not initialized. Call initialize() first.');
        }
        return this.dataLoader.getAllTilingTypes().map(t => t.id);
    }
}
