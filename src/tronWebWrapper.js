// This is a wrapper for TronWeb to handle ESM compatibility issues
const { createRequire } = require('module');
const require2 = createRequire(import.meta.url);

// Dynamic import for @noble/secp256k1
async function initTronWeb() {
  try {
    // Import the ESM module dynamically
    const secp256k1 = await import('@noble/secp256k1');
    
    // Make it globally available for TronWeb
    global.secp256k1 = secp256k1;
    
    // Now import TronWeb which will use the global secp256k1
    const TronWeb = require2('tronweb');
    
    return TronWeb;
  } catch (error) {
    console.error('Error initializing TronWeb:', error);
    throw error;
  }
}

module.exports = { initTronWeb };
