const TronWeb = require('tronweb');

async function initializeTronWeb() {
  try {
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      headers: { "TRON-PRO-API-KEY": process.env.TRX_API_KEY },
    });
    
    console.log('TronWeb initialized successfully');
    return tronWeb;
  } catch (error) {
    console.error('Error initializing TronWeb:', error);
    throw error;
  }
}

module.exports = {
  initializeTronWeb
};
