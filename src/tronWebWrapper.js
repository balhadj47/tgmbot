// Mock TronWeb wrapper for blockchain interactions
// This completely avoids the ESM compatibility issue by not requiring the actual TronWeb library

let tronWeb = null;

// Initialize mock TronWeb
async function initializeTronWeb() {
  try {
    console.log('Creating mock TronWeb instance for development...');
    
    // Create a minimal mock TronWeb instance for development
    tronWeb = {
      trx: {
        getBalance: async (address) => {
          console.log(`Mock: Getting balance for ${address}`);
          return '1000000000'; // 1000 TRX in SUN units
        },
        getAccount: async (address) => {
          console.log(`Mock: Getting account for ${address}`);
          return { 
            address: address,
            balance: '1000000000',
            create_time: Date.now(),
            latest_opration_time: Date.now()
          };
        },
        getTransaction: async (txId) => {
          console.log(`Mock: Getting transaction ${txId}`);
          return { 
            txID: txId,
            blockNumber: 12345678,
            blockTimeStamp: Date.now()
          };
        }
      },
      transactionBuilder: {
        sendTrx: async (toAddress, amount) => {
          console.log(`Mock: Sending ${amount} SUN to ${toAddress}`);
          return { 
            txID: `mock-tx-${Date.now()}`,
            visible: true,
            raw_data: {
              contract: [{
                parameter: {
                  value: {
                    amount: amount,
                    owner_address: "MOCK_OWNER_ADDRESS",
                    to_address: toAddress
                  }
                }
              }]
            }
          };
        }
      },
      address: {
        fromPrivateKey: (privateKey) => {
          console.log(`Mock: Getting address from private key`);
          return 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8';
        },
        toHex: (address) => {
          console.log(`Mock: Converting address to hex`);
          return '41' + address.replace('T', '');
        }
      },
      createAccount: async () => {
        console.log('Mock: Creating new account');
        return {
          address: {
            base58: 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8',
            hex: '41E552F6487585C2B58BC2C9BB4492BC1F17132CD0'
          },
          privateKey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
        };
      },
      fromSun: (sunAmount) => {
        return sunAmount / 1000000;
      },
      toSun: (trxAmount) => {
        return trxAmount * 1000000;
      },
      setPrivateKey: (privateKey) => {
        console.log('Mock: Setting private key');
        return true;
      }
    };
    
    console.log('Mock TronWeb initialized successfully');
    return tronWeb;
  } catch (error) {
    console.error('Error creating mock TronWeb:', error);
    throw error;
  }
}

// Get TronWeb instance
function getTronWeb() {
  if (!tronWeb) {
    throw new Error('TronWeb not initialized');
  }
  return tronWeb;
}

module.exports = {
  initializeTronWeb,
  getTronWeb
};
