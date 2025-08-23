/**
 * Tiling Data Loader
 * 
 * Loads and manages tiling data from the extracted data structures.
 * Provides a clean interface for accessing tiling type information.
 */

import { TilingType } from '../core/TilingType.js';
import { EdgeShape } from '../constants/EdgeShape.js';
import {
    // Import all data arrays
    es_00, es_01, es_02, es_03, es_04, es_05, es_06, es_07, es_08, es_09,
    es_10, es_11, es_12, es_13, es_14, es_15, es_16, es_17, es_18, es_19,
    es_20, es_21, es_22, es_23, es_24, es_25, es_26, es_27, es_28, es_29,
    es_30, es_31, es_32, es_33, es_34, es_35, es_36, es_37,
    
    esi_00, esi_01, esi_02, esi_03, esi_04, esi_05, esi_06, esi_07, esi_08, esi_09,
    esi_10, esi_11, esi_12, esi_13, esi_14, esi_15, esi_16, esi_17, esi_18, esi_19,
    esi_20, esi_21, esi_22, esi_23, esi_24, esi_25, esi_26, esi_27, esi_28, esi_29,
    
    eo_00, eo_01, eo_02, eo_03, eo_04, eo_05, eo_06, eo_07, eo_08, eo_09,
    eo_10, eo_11, eo_12, eo_13, eo_14, eo_15, eo_16, eo_17, eo_18, eo_19,
    eo_20, eo_21, eo_22, eo_23, eo_24, eo_25, eo_26, eo_27, eo_28, eo_29,
    eo_30, eo_31, eo_32, eo_33, eo_34, eo_35, eo_36, eo_37, eo_38, eo_39,
    eo_40, eo_41, eo_42, eo_43, eo_44,
    
    dp_00, dp_01, dp_02, dp_03, dp_04, dp_05, dp_06, dp_07, dp_08, dp_09,
    dp_10, dp_11, dp_12, dp_13, dp_14, dp_15, dp_16, dp_17, dp_18, dp_19,
    dp_20, dp_21, dp_22, dp_23, dp_24, dp_25, dp_26, dp_27, dp_28, dp_29,
    dp_30, dp_31, dp_32,
    
    tvc_00, tvc_01, tvc_02, tvc_03, tvc_04, tvc_05, tvc_06, tvc_07, tvc_08, tvc_09,
    tvc_10, tvc_11, tvc_12, tvc_13, tvc_14, tvc_15, tvc_16, tvc_17, tvc_18, tvc_19,
    tvc_20, tvc_21, tvc_22, tvc_23, tvc_24, tvc_25, tvc_26, tvc_27, tvc_28, tvc_29,
    tvc_30, tvc_31, tvc_32, tvc_33, tvc_34, tvc_35, tvc_36, tvc_37, tvc_38, tvc_39,
    tvc_40, tvc_41, tvc_42,
    
    tc_00, tc_01, tc_02, tc_03, tc_04, tc_05, tc_06, tc_07, tc_08, tc_09,
    tc_10, tc_11, tc_12, tc_13, tc_14, tc_15, tc_16, tc_17, tc_18, tc_19,
    tc_20, tc_21, tc_22, tc_23, tc_24, tc_25, tc_26, tc_27, tc_28, tc_29,
    tc_30, tc_31, tc_32, tc_33, tc_34, tc_35, tc_36, tc_37, tc_38, tc_39,
    tc_40, tc_41, tc_42, tc_43, tc_44, tc_45, tc_46, tc_47, tc_48, tc_49,
    tc_50, tc_51, tc_52, tc_53, tc_54, tc_55, tc_56, tc_57, tc_58, tc_59,
    tc_60, tc_61,
    
    ac_00, ac_01, ac_02, ac_03, ac_04, ac_05, ac_06, ac_07, ac_08, ac_09,
    ac_10, ac_11, ac_12, ac_13, ac_14, ac_15, ac_16, ac_17, ac_18, ac_19,
    ac_20, ac_21, ac_22, ac_23, ac_24, ac_25, ac_26, ac_27, ac_28, ac_29,
    ac_30, ac_31, ac_32, ac_33, ac_34, ac_35, ac_36, ac_37, ac_38, ac_39,
    ac_40, ac_41, ac_42, ac_43, ac_44, ac_45, ac_46, ac_47, ac_48, ac_49,
    ac_50, ac_51, ac_52, ac_53, ac_54, ac_55, ac_56, ac_57, ac_58, ac_59,
    ac_60, ac_61, ac_62, ac_63, ac_64,
    
    c_00, c_01, c_02, c_03, c_04, c_05, c_06, c_07, c_08, c_09,
    c_10, c_11, c_12, c_13, c_14, c_15, c_16, c_17, c_18, c_19,
    c_20, c_21, c_22, c_23, c_24, c_25, c_26, c_27, c_28,
    
    // Import constants
    VALID_TILING_TYPES,
    NUM_TILING_TYPES,
    TILING_TYPE_DEFINITIONS
} from './TilingData.js';

export class TilingDataLoader {
    constructor() {
        this.tilingTypes = new Map();
        this.initialized = false;
        this.dataArrays = {
            edgeShapes: { es_00, es_01, es_02, es_03, es_04, es_05, es_06, es_07, es_08, es_09,
                         es_10, es_11, es_12, es_13, es_14, es_15, es_16, es_17, es_18, es_19,
                         es_20, es_21, es_22, es_23, es_24, es_25, es_26, es_27, es_28, es_29,
                         es_30, es_31, es_32, es_33, es_34, es_35, es_36, es_37 },
            
            edgeShapeIds: { esi_00, esi_01, esi_02, esi_03, esi_04, esi_05, esi_06, esi_07, esi_08, esi_09,
                           esi_10, esi_11, esi_12, esi_13, esi_14, esi_15, esi_16, esi_17, esi_18, esi_19,
                           esi_20, esi_21, esi_22, esi_23, esi_24, esi_25, esi_26, esi_27, esi_28, esi_29 },
            
            edgeOrientations: { eo_00, eo_01, eo_02, eo_03, eo_04, eo_05, eo_06, eo_07, eo_08, eo_09,
                               eo_10, eo_11, eo_12, eo_13, eo_14, eo_15, eo_16, eo_17, eo_18, eo_19,
                               eo_20, eo_21, eo_22, eo_23, eo_24, eo_25, eo_26, eo_27, eo_28, eo_29,
                               eo_30, eo_31, eo_32, eo_33, eo_34, eo_35, eo_36, eo_37, eo_38, eo_39,
                               eo_40, eo_41, eo_42, eo_43, eo_44 },
            
            defaultParams: { dp_00, dp_01, dp_02, dp_03, dp_04, dp_05, dp_06, dp_07, dp_08, dp_09,
                            dp_10, dp_11, dp_12, dp_13, dp_14, dp_15, dp_16, dp_17, dp_18, dp_19,
                            dp_20, dp_21, dp_22, dp_23, dp_24, dp_25, dp_26, dp_27, dp_28, dp_29,
                            dp_30, dp_31, dp_32 },
            
            vertexCoeffs: { tvc_00, tvc_01, tvc_02, tvc_03, tvc_04, tvc_05, tvc_06, tvc_07, tvc_08, tvc_09,
                           tvc_10, tvc_11, tvc_12, tvc_13, tvc_14, tvc_15, tvc_16, tvc_17, tvc_18, tvc_19,
                           tvc_20, tvc_21, tvc_22, tvc_23, tvc_24, tvc_25, tvc_26, tvc_27, tvc_28, tvc_29,
                           tvc_30, tvc_31, tvc_32, tvc_33, tvc_34, tvc_35, tvc_36, tvc_37, tvc_38, tvc_39,
                           tvc_40, tvc_41, tvc_42 },
            
            translationCoeffs: { tc_00, tc_01, tc_02, tc_03, tc_04, tc_05, tc_06, tc_07, tc_08, tc_09,
                                tc_10, tc_11, tc_12, tc_13, tc_14, tc_15, tc_16, tc_17, tc_18, tc_19,
                                tc_20, tc_21, tc_22, tc_23, tc_24, tc_25, tc_26, tc_27, tc_28, tc_29,
                                tc_30, tc_31, tc_32, tc_33, tc_34, tc_35, tc_36, tc_37, tc_38, tc_39,
                                tc_40, tc_41, tc_42, tc_43, tc_44, tc_45, tc_46, tc_47, tc_48, tc_49,
                                tc_50, tc_51, tc_52, tc_53, tc_54, tc_55, tc_56, tc_57, tc_58, tc_59,
                                tc_60, tc_61 },
            
            aspectCoeffs: { ac_00, ac_01, ac_02, ac_03, ac_04, ac_05, ac_06, ac_07, ac_08, ac_09,
                           ac_10, ac_11, ac_12, ac_13, ac_14, ac_15, ac_16, ac_17, ac_18, ac_19,
                           ac_20, ac_21, ac_22, ac_23, ac_24, ac_25, ac_26, ac_27, ac_28, ac_29,
                           ac_30, ac_31, ac_32, ac_33, ac_34, ac_35, ac_36, ac_37, ac_38, ac_39,
                           ac_40, ac_41, ac_42, ac_43, ac_44, ac_45, ac_46, ac_47, ac_48, ac_49,
                           ac_50, ac_51, ac_52, ac_53, ac_54, ac_55, ac_56, ac_57, ac_58, ac_59,
                           ac_60, ac_61, ac_62, ac_63, ac_64 },
            
            coloring: { c_00, c_01, c_02, c_03, c_04, c_05, c_06, c_07, c_08, c_09,
                       c_10, c_11, c_12, c_13, c_14, c_15, c_16, c_17, c_18, c_19,
                       c_20, c_21, c_22, c_23, c_24, c_25, c_26, c_27, c_28 }
        };
    }

    /**
     * Initialize the data loader and create TilingType instances
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        console.log('Initializing TilingDataLoader...');
        console.log(`Loading ${VALID_TILING_TYPES.length} tiling types...`);

        // Create TilingType instances for each valid tiling type
        for (const typeId of VALID_TILING_TYPES) {
            const tilingType = this.createTilingType(typeId);
            if (tilingType) {
                this.tilingTypes.set(typeId, tilingType);
            }
        }

        this.initialized = true;
        console.log(`Successfully loaded ${this.tilingTypes.size} tiling types`);
    }

    /**
     * Create a TilingType instance for the given type ID
     */
    createTilingType(typeId) {
        const definition = TILING_TYPE_DEFINITIONS[typeId];
        if (!definition) {
            // Some tiling types don't have definitions in the original library
            // This is expected for types 82, 83, 84, 85, 86, 88, 90, 91, 93
            return null;
        }

        // The definition already contains direct references to the data arrays
        const config = {
            num_params: parseInt(definition.num_params),
            num_aspects: parseInt(definition.num_aspects),
            num_vertices: parseInt(definition.num_vertices),
            num_edge_shapes: parseInt(definition.num_edge_shapes),
            edge_shapes: definition.edge_shapes,
            edge_shape_ids: definition.edge_shape_ids,
            edge_orientations: definition.edge_orientations,
            default_params: definition.default_params,
            vertex_coeffs: definition.vertex_coeffs,
            translation_coeffs: definition.translation_coeffs,
            aspect_coeffs: definition.aspect_coeffs,
            coloring: definition.colouring
        };

        return new TilingType(typeId, config);
    }

    /**
     * Get a data array by name from the appropriate category (deprecated - using direct references now)
     */
    getDataArray(arrayName, category) {
        // This method is no longer needed since we use direct array references
        // Keeping for backward compatibility
        if (!arrayName || !this.dataArrays[category]) {
            return null;
        }

        const array = this.dataArrays[category][arrayName];
        if (!array) {
            // No longer warn since we use direct references
            return null;
        }

        return array;
    }

    /**
     * Get a TilingType instance by ID
     */
    getTilingType(typeId) {
        if (!this.initialized) {
            throw new Error('TilingDataLoader not initialized. Call initialize() first.');
        }

        return this.tilingTypes.get(typeId) || null;
    }

    /**
     * Get all loaded tiling types
     */
    getAllTilingTypes() {
        if (!this.initialized) {
            throw new Error('TilingDataLoader not initialized. Call initialize() first.');
        }

        return Array.from(this.tilingTypes.values());
    }

    /**
     * Get valid tiling type IDs
     */
    getValidTilingTypes() {
        return [...VALID_TILING_TYPES];
    }

    /**
     * Get the total number of tiling types
     */
    getNumTilingTypes() {
        return NUM_TILING_TYPES;
    }

    /**
     * Validate that all required data arrays are available
     */
    validateDataIntegrity() {
        const issues = [];

        // Check that all tiling type definitions have their required data arrays
        for (const [typeId, definition] of Object.entries(TILING_TYPE_DEFINITIONS)) {
            const requiredFields = ['edge_shapes', 'edge_shape_ids', 'edge_orientations', 
                                   'default_params', 'vertex_coeffs', 'translation_coeffs', 
                                   'aspect_coeffs', 'colouring'];

            for (const field of requiredFields) {
                const array = definition[field];
                if (array === undefined || array === null) {
                    issues.push(`Tiling type ${typeId}: Missing ${field} data`);
                } else if (Array.isArray(array) && array.length === 0) {
                    issues.push(`Tiling type ${typeId}: Empty ${field} array`);
                }
            }
        }

        return issues;
    }

    /**
     * Get the data category for a field name
     */
    getCategoryForField(fieldName) {
        const fieldMap = {
            'edge_shapes': 'edgeShapes',
            'edge_shape_ids': 'edgeShapeIds',
            'edge_orientations': 'edgeOrientations',
            'default_params': 'defaultParams',
            'vertex_coeffs': 'vertexCoeffs',
            'translation_coeffs': 'translationCoeffs',
            'aspect_coeffs': 'aspectCoeffs',
            'colouring': 'coloring'
        };

        return fieldMap[fieldName] || null;
    }

    /**
     * Get statistics about the loaded data
     */
    getStatistics() {
        return {
            totalTilingTypes: this.tilingTypes.size,
            validTilingTypeIds: VALID_TILING_TYPES,
            dataArrayCounts: {
                edgeShapes: Object.keys(this.dataArrays.edgeShapes).length,
                edgeShapeIds: Object.keys(this.dataArrays.edgeShapeIds).length,
                edgeOrientations: Object.keys(this.dataArrays.edgeOrientations).length,
                defaultParams: Object.keys(this.dataArrays.defaultParams).length,
                vertexCoeffs: Object.keys(this.dataArrays.vertexCoeffs).length,
                translationCoeffs: Object.keys(this.dataArrays.translationCoeffs).length,
                aspectCoeffs: Object.keys(this.dataArrays.aspectCoeffs).length,
                coloring: Object.keys(this.dataArrays.coloring).length
            },
            initialized: this.initialized
        };
    }
}

export default TilingDataLoader;
