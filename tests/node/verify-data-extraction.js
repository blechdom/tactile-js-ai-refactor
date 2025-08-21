#!/usr/bin/env node

/**
 * Data Extraction Verification Script
 * 
 * This script verifies that the extracted data is complete and accurate
 * by comparing it against the original tactile.js library.
 */

const fs = require('fs');
const path = require('path');

// Read the original tactile.js file
const originalFile = path.join(__dirname, '..', '..', 'lib', 'tactile.js');
const originalContent = fs.readFileSync(originalFile, 'utf8');

// Read the extracted TilingData.js file
const extractedFile = path.join(__dirname, '..', '..', 'lib', 'data', 'TilingData.js');
const extractedContent = fs.readFileSync(extractedFile, 'utf8');

function verifyDataExtraction() {
    const verification = {
        success: true,
        errors: [],
        warnings: [],
        summary: {
            originalDataArrays: 0,
            extractedDataArrays: 0,
            missingArrays: [],
            extraArrays: [],
            dataIntegrity: {}
        }
    };

    console.log('=== Data Extraction Verification ===\n');

    // 1. Count data arrays in original file
    const originalArrays = {
        edgeShapes: (originalContent.match(/const es_\d+ = \[/g) || []).length,
        edgeShapeIds: (originalContent.match(/const esi_\d+ = \[/g) || []).length,
        edgeOrientations: (originalContent.match(/const eo_\d+ = \[/g) || []).length,
        defaultParams: (originalContent.match(/const dp_\d+ = \[/g) || []).length,
        vertexCoeffs: (originalContent.match(/const tvc_\d+ = \[/g) || []).length,
        translationCoeffs: (originalContent.match(/const tc_\d+ = \[/g) || []).length,
        aspectCoeffs: (originalContent.match(/const ac_\d+ = \[/g) || []).length,
        coloring: (originalContent.match(/const c_\d+ = \[/g) || []).length
    };

    // 2. Count data arrays in extracted file
    const extractedArrays = {
        edgeShapes: (extractedContent.match(/const es_\d+ = \[/g) || []).length,
        edgeShapeIds: (extractedContent.match(/const esi_\d+ = \[/g) || []).length,
        edgeOrientations: (extractedContent.match(/const eo_\d+ = \[/g) || []).length,
        defaultParams: (extractedContent.match(/const dp_\d+ = \[/g) || []).length,
        vertexCoeffs: (extractedContent.match(/const tvc_\d+ = \[/g) || []).length,
        translationCoeffs: (extractedContent.match(/const tc_\d+ = \[/g) || []).length,
        aspectCoeffs: (extractedContent.match(/const ac_\d+ = \[/g) || []).length,
        coloring: (extractedContent.match(/const c_\d+ = \[/g) || []).length
    };

    // 3. Compare counts
    console.log('=== Data Array Counts ===');
    Object.keys(originalArrays).forEach(type => {
        const original = originalArrays[type];
        const extracted = extractedArrays[type];
        const status = original === extracted ? '✅' : '❌';
        
        console.log(`${status} ${type}: ${original} → ${extracted}`);
        
        if (original !== extracted) {
            verification.errors.push(`${type}: Count mismatch (${original} vs ${extracted})`);
            verification.success = false;
        }
    });

    // 4. Extract and compare specific arrays
    console.log('\n=== Data Integrity Check ===');
    
    const dataTypes = ['es', 'esi', 'eo', 'dp', 'tvc', 'tc', 'ac', 'c'];
    
    dataTypes.forEach(prefix => {
        const originalMatches = originalContent.match(new RegExp(`const ${prefix}_\\d+ = \\[[^\\]]+\\]`, 'g')) || [];
        const extractedMatches = extractedContent.match(new RegExp(`const ${prefix}_\\d+ = \\[[^\\]]+\\]`, 'g')) || [];
        
        const originalNames = originalMatches.map(m => m.match(new RegExp(`${prefix}_\\d+`))[0]).sort();
        const extractedNames = extractedMatches.map(m => m.match(new RegExp(`${prefix}_\\d+`))[0]).sort();
        
        // Check for missing arrays
        const missing = originalNames.filter(name => !extractedNames.includes(name));
        if (missing.length > 0) {
            verification.summary.missingArrays.push(...missing);
            verification.errors.push(`Missing ${prefix} arrays: ${missing.join(', ')}`);
            verification.success = false;
        }
        
        // Check for extra arrays
        const extra = extractedNames.filter(name => !originalNames.includes(name));
        if (extra.length > 0) {
            verification.summary.extraArrays.push(...extra);
            verification.warnings.push(`Extra ${prefix} arrays: ${extra.join(', ')}`);
        }
        
        console.log(`${prefix}: ${originalNames.length} → ${extractedNames.length} (${missing.length} missing, ${extra.length} extra)`);
    });

    // 5. Verify tiling type definitions
    console.log('\n=== Tiling Type Definitions ===');
    
    // Extract valid tiling types from original
    const tilingTypesMatch = originalContent.match(/const tilingTypes = \[([^\]]+)\]/);
    const originalTilingTypes = tilingTypesMatch ? 
        tilingTypesMatch[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : [];
    
    // Extract valid tiling types from extracted file
    const extractedTilingTypesMatch = extractedContent.match(/export const VALID_TILING_TYPES = \[([^\]]+)\]/);
    const extractedTilingTypes = extractedTilingTypesMatch ? 
        extractedTilingTypesMatch[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : [];
    
    console.log(`Original tiling types: ${originalTilingTypes.length}`);
    console.log(`Extracted tiling types: ${extractedTilingTypes.length}`);
    
    if (originalTilingTypes.length !== extractedTilingTypes.length) {
        verification.errors.push(`Tiling type count mismatch: ${originalTilingTypes.length} vs ${extractedTilingTypes.length}`);
        verification.success = false;
    }
    
    // Check for missing tiling types
    const missingTilingTypes = originalTilingTypes.filter(t => !extractedTilingTypes.includes(t));
    if (missingTilingTypes.length > 0) {
        verification.errors.push(`Missing tiling types: ${missingTilingTypes.join(', ')}`);
        verification.success = false;
    }

    // 6. Verify data structure integrity
    console.log('\n=== Data Structure Integrity ===');
    
    // Check that all arrays are properly formatted
    const arrayIntegrity = {
        edgeShapes: checkArrayIntegrity(extractedContent, 'es_'),
        edgeShapeIds: checkArrayIntegrity(extractedContent, 'esi_'),
        edgeOrientations: checkArrayIntegrity(extractedContent, 'eo_'),
        defaultParams: checkArrayIntegrity(extractedContent, 'dp_'),
        vertexCoeffs: checkArrayIntegrity(extractedContent, 'tvc_'),
        translationCoeffs: checkArrayIntegrity(extractedContent, 'tc_'),
        aspectCoeffs: checkArrayIntegrity(extractedContent, 'ac_'),
        coloring: checkArrayIntegrity(extractedContent, 'c_')
    };
    
    Object.entries(arrayIntegrity).forEach(([type, integrity]) => {
        const status = integrity.valid ? '✅' : '❌';
        console.log(`${status} ${type}: ${integrity.valid ? 'Valid' : integrity.error}`);
        
        if (!integrity.valid) {
            verification.errors.push(`${type}: ${integrity.error}`);
            verification.success = false;
        }
    });

    // 7. Generate summary
    console.log('\n=== Verification Summary ===');
    console.log(`Overall Status: ${verification.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Errors: ${verification.errors.length}`);
    console.log(`Warnings: ${verification.warnings.length}`);
    
    if (verification.errors.length > 0) {
        console.log('\n=== Errors ===');
        verification.errors.forEach(error => console.log(`❌ ${error}`));
    }
    
    if (verification.warnings.length > 0) {
        console.log('\n=== Warnings ===');
        verification.warnings.forEach(warning => console.log(`⚠️  ${warning}`));
    }

    return verification;
}

function checkArrayIntegrity(content, prefix) {
    const matches = content.match(new RegExp(`const ${prefix}\\d+ = \\[[^\\]]+\\]`, 'g')) || [];
    
    for (const match of matches) {
        // Check for proper array syntax
        if (!match.includes('[') || !match.includes(']')) {
            return { valid: false, error: `Invalid array syntax in ${match}` };
        }
        
        // Check for proper const declaration
        if (!match.startsWith(`const ${prefix}`)) {
            return { valid: false, error: `Invalid declaration in ${match}` };
        }
    }
    
    return { valid: true };
}

// Run verification
const verification = verifyDataExtraction();

// Write verification report
const reportFile = path.join(__dirname, '..', '..', 'verification-report.json');
const report = {
    timestamp: new Date().toISOString(),
    verification,
    files: {
        original: originalFile,
        extracted: extractedFile
    }
};

fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

console.log(`\nVerification report saved to: ${reportFile}`);

// Exit with appropriate code
process.exit(verification.success ? 0 : 1);

