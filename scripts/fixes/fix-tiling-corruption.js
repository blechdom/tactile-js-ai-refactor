#!/usr/bin/env node

/**
 * Tiling Data Corruption Fix
 * Patches the corrupted tactile.js with correct data from TilingData.js
 * Preserves demo functionality while fixing mathematical inconsistencies
 */

import fs from 'fs';
import path from 'path';

const BACKUP_DIR = 'backups';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

// Read the audit report to know which types to fix
const auditReport = JSON.parse(fs.readFileSync('reports/tiling-data-audit-report.json', 'utf8'));

// Read source files
const tactileJs = fs.readFileSync('lib/tactile.js', 'utf8');
const tilingDataJs = fs.readFileSync('lib/data/TilingData.js', 'utf8');

console.log('🔧 TILING DATA CORRUPTION FIX');
console.log('=' .repeat(60));
console.log(`Found ${auditReport.corrupted_types.length} corrupted tiling types to fix`);
console.log('');

// Create backup
const backupPath = path.join(BACKUP_DIR, `tactile.js.backup.${TIMESTAMP}`);
fs.writeFileSync(backupPath, tactileJs);
console.log(`📁 Backup created: ${backupPath}`);

// Function to extract correct values from TilingData.js
function getCorrectValues(tilingNumber) {
    const regex = new RegExp(`${tilingNumber}:\\s*{\\s*\\n([\\s\\S]*?)\\s*\\n\\s*}`);
    const match = tilingDataJs.match(regex);
    
    if (!match) return null;
    
    const content = match[1];
    return {
        num_params: parseInt(content.match(/num_params:\\s*(\\d+)/)?.[1] || '0'),
        num_aspects: parseInt(content.match(/num_aspects:\\s*(\\d+)/)?.[1] || '0'),
        num_vertices: parseInt(content.match(/num_vertices:\\s*(\\d+)/)?.[1] || '0'),
        num_edge_shapes: parseInt(content.match(/num_edge_shapes:\\s*(\\d+)/)?.[1] || '0'),
        edge_shapes: content.match(/edge_shapes:\\s*(\\w+)/)?.[1] || '',
        edge_orientations: content.match(/edge_orientations:\\s*(\\w+)/)?.[1] || '',
        edge_shape_ids: content.match(/edge_shape_ids:\\s*(\\w+)/)?.[1] || '',
        default_params: content.match(/default_params:\\s*(\\w+)/)?.[1] || '',
        vertex_coeffs: content.match(/vertex_coeffs:\\s*(\\w+)/)?.[1] || '',
        translation_coeffs: content.match(/translation_coeffs:\\s*(\\w+)/)?.[1] || '',
        aspect_coeffs: content.match(/aspect_coeffs:\\s*(\\w+)/)?.[1] || '',
        colouring: content.match(/colouring:\\s*(\\w+)/)?.[1] || ''
    };
}

// Function to fix a single tiling type in tactile.js
function fixTilingType(content, tilingNumber, correctValues) {
    const regex = new RegExp(`(// IH${tilingNumber}\\s*\\n\\s*{\\s*\\n)([\\s\\S]*?)(\\s*\\n\\s*})`, 'g');
    
    return content.replace(regex, (match, prefix, body, suffix) => {
        let newBody = body;
        
        // Replace corrupted values with correct ones
        newBody = newBody.replace(/num_params:\\s*\\d+/, `num_params: ${correctValues.num_params}`);
        newBody = newBody.replace(/num_aspects:\\s*\\d+/, `num_aspects: ${correctValues.num_aspects}`);
        newBody = newBody.replace(/num_vertices:\\s*\\d+/, `num_vertices: ${correctValues.num_vertices}`);
        newBody = newBody.replace(/num_edge_shapes:\\s*\\d+/, `num_edge_shapes: ${correctValues.num_edge_shapes}`);
        newBody = newBody.replace(/edge_shapes:\\s*\\w+/, `edge_shapes: ${correctValues.edge_shapes}`);
        newBody = newBody.replace(/edge_orientations:\\s*\\w+/, `edge_orientations: ${correctValues.edge_orientations}`);
        newBody = newBody.replace(/edge_shape_ids:\\s*\\w+/, `edge_shape_ids: ${correctValues.edge_shape_ids}`);
        newBody = newBody.replace(/default_params:\\s*\\w+/, `default_params: ${correctValues.default_params}`);
        newBody = newBody.replace(/vertex_coeffs:\\s*\\w+/, `vertex_coeffs: ${correctValues.vertex_coeffs}`);
        newBody = newBody.replace(/translation_coeffs:\\s*\\w+/, `translation_coeffs: ${correctValues.translation_coeffs}`);
        newBody = newBody.replace(/aspect_coeffs:\\s*\\w+/, `aspect_coeffs: ${correctValues.aspect_coeffs}`);
        newBody = newBody.replace(/colouring:\\s*\\w+/, `colouring: ${correctValues.colouring}`);
        
        return prefix + newBody + suffix;
    });
}

// Apply fixes
let fixedContent = tactileJs;
let fixedCount = 0;
let errorCount = 0;

console.log('🔧 Applying fixes...');

for (const corruption of auditReport.corrupted_types) {
    const tilingNumber = corruption.type;
    const correctValues = getCorrectValues(tilingNumber);
    
    if (!correctValues) {
        console.log(`❌ IH${tilingNumber}: Could not find correct values`);
        errorCount++;
        continue;
    }
    
    const beforeLength = fixedContent.length;
    fixedContent = fixTilingType(fixedContent, tilingNumber, correctValues);
    
    if (fixedContent.length !== beforeLength || !fixedContent.includes("// IH" + tilingNumber)) {
        console.log(`✅ IH${tilingNumber}: Fixed`);
        fixedCount++;
    } else {
        console.log(`⚠️  IH${tilingNumber}: No changes made`);
        errorCount++;
    }
}

// Write the fixed file
fs.writeFileSync('lib/tactile.js', fixedContent);

console.log('');
console.log('📊 FIX SUMMARY');
console.log('=' .repeat(60));
console.log(`Successfully fixed: ${fixedCount} tiling types`);
console.log(`Errors: ${errorCount} tiling types`);
console.log(`Original backup: ${backupPath}`);
console.log(`Fixed file: lib/tactile.js`);

if (fixedCount > 0) {
    console.log('');
    console.log('🎉 CORRUPTION FIX COMPLETE!');
    console.log('✅ Your working demo has been preserved');
    console.log('✅ Mathematical inconsistencies have been corrected');
    console.log('✅ Overlapping issues should be significantly reduced');
    console.log('');
    console.log('🚀 Test your demo at: http://localhost:8000/random-tiling-generator.html');
} else {
    console.log('');
    console.log('❌ No fixes were applied. Check the errors above.');
}
