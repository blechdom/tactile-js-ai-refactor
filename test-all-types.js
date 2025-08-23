#!/usr/bin/env node

// Test EVERY tiling type systematically
import('./lib/tactile.js').then(tactile => {
  import('./lib/data/TilingData.js').then(data => {
    console.log('🔍 Testing ALL tiling types systematically...\n');
    
    const problematicTypes = [];
    const validTypes = [];
    
    console.log('tilingTypes array length:', tactile.tilingTypes.length);
    console.log('TILING_TYPE_DEFINITIONS keys:', Object.keys(data.TILING_TYPE_DEFINITIONS).length);
    console.log('');
    
    for (const type of tactile.tilingTypes) {
      try {
        // Check if definition exists
        const definition = data.TILING_TYPE_DEFINITIONS[type];
        if (!definition) {
          console.log('❌ Type', type, 'has NO definition in TILING_TYPE_DEFINITIONS');
          problematicTypes.push(type);
          continue;
        }
        
        if (!definition.default_params) {
          console.log('❌ Type', type, 'definition exists but missing default_params');
          problematicTypes.push(type);
          continue;
        }
        
        // Try creating the tiling
        const tiling = new tactile.IsohedralTiling(type);
        validTypes.push(type);
        
      } catch (error) {
        console.log('❌ Type', type, 'ERROR:', error.message);
        problematicTypes.push(type);
      }
    }
    
    console.log('\n📊 RESULTS:');
    console.log('✅ Valid types:', validTypes.length);
    console.log('❌ Problematic types:', problematicTypes.length);
    
    if (problematicTypes.length > 0) {
      console.log('\n🚨 Problematic types that need to be removed:');
      console.log(problematicTypes);
      
      console.log('\nFixed tilingTypes array should be:');
      console.log('[' + validTypes.join(', ') + ']');
    } else {
      console.log('\n🎉 ALL types are valid!');
    }
    
    console.log('\nFirst 10 valid types for reference:', validTypes.slice(0, 10));
    
  }).catch(console.error);
}).catch(console.error);
