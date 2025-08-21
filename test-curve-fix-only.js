#!/usr/bin/env node

/**
 * Test: Curve Fix Only
 * Reverts the data "corruption" fixes to test if curve constraints alone resolve overlapping
 * This will help determine if the data differences were actually corruption or just variations
 */

import fs from 'fs';

console.log('🧪 TESTING: CURVE FIX ONLY');
console.log('=' .repeat(60));
console.log('Reverting data changes to test if curve fixes alone resolve overlapping');
console.log('');

// Create backup of current state (has both data and curve fixes)
const currentTactile = fs.readFileSync('lib/tactile.js', 'utf8');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = `backups/tactile.js.backup.both-fixes-${timestamp}`;
fs.writeFileSync(backupPath, currentTactile);
console.log(`📁 Current state backup: ${backupPath}`);

// Restore the original version (before any data fixes were applied)
const originalTactile = fs.readFileSync('backups/tactile.js.backup.2025-08-21T22-12-59', 'utf8');
fs.writeFileSync('lib/tactile.js', originalTactile);

console.log('');
console.log('✅ Reverted tactile.js to pre-data-fix state');
console.log('✅ Kept curve constraint fixes in demo');
console.log('');
console.log('🧪 Test Scenario:');
console.log('   • Data "corruption" fixes: REVERTED');
console.log('   • Curve constraint fixes: ACTIVE');
console.log('');
console.log('📊 What to test:');
console.log('   1. Generate tilings with curves (J, S, U edge shapes)');
console.log('   2. Look for overlapping issues');
console.log('   3. Check the previously problematic types: IH24, IH30, IH36, IH37');
console.log('');
console.log('💡 Expected outcomes:');
console.log('   • If overlapping is GONE: Data fixes were unnecessary');
console.log('   • If overlapping PERSISTS: Data fixes were actually needed');
console.log('');
console.log('🚀 Test at: http://localhost:8000/random-tiling-generator.html');
console.log('');
console.log('⚠️  Note: You can easily restore both fixes if needed from the backup');
