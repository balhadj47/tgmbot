const bip39 = require('bip39');
const ethers = require('ethers');
const TronWeb = require('tronweb');
const { query } = require('./database');

// Initialize TronWeb
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { "TRON-PRO-API-KEY": process.env.TRX_API_KEY }
});

// BSC provider
const bscProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

// USDT contract addresses
const USDT_TRC20_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT on Tron
const USDT_BEP20_CONTRACT = '0x55d398326f99059fF775485246999027B3197955'; // USDT on BSC

// USDT BEP20 ABI (minimal for balance checking)
const USDT_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

// Generate a new wallet with mnemonic
async function generateWallet() {
  // Generate a random mnemonic
  const mnemonic = bip39.generateMnemonic();
  
  // Derive TRX address
  const privateKey = ethers.utils.hdNode.fromMnemonic(mnemonic).privateKey;
  const trxAddress = tronWeb.address.fromPrivateKey(privateKey.substring(2));
  
  // Derive BSC address
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const bscAddress = wallet.address;
  
  return {
    mnemonic,
    trxAddress,
    bscAddress
  };
}

// Get TRC20 USDT balance
async function getTRC20Balance(address) {
  try {
    const contract = await tronWeb.contract().at(USDT_TRC20_CONTRACT);
    const balance = await contract.balanceOf(address).call();
    return parseFloat(tronWeb.fromSun(balance)) / 1000000;
  } catch (error) {
    console.error('Error getting TRC20 balance:', error);
    return 0;
  }
}

// Get BEP20 USDT balance
async function getBEP20Balance(address) {
  try {
    const contract = new ethers.Contract(USDT_BEP20_CONTRACT, USDT_ABI, bscProvider);
    const balance = await contract.balanceOf(address);
    return parseFloat(ethers.utils.formatUnits(balance, 18));
  } catch (error) {
    console.error('Error getting BEP20 balance:', error);
    return 0;
  }
}

// Update user's wallet balances
async function updateUserBalances(userId) {
  try {
    // Get user's wallet addresses
    const [rows] = await query(
      'SELECT trx_address, bsc_address FROM users WHERE user_id = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    
    const { trx_address, bsc_address } = rows[0];
    
    // Get balances
    const trc20Balance = await getTRC20Balance(trx_address);
    const bep20Balance = await getBEP20Balance(bsc_address);
    const totalBalance = trc20Balance + bep20Balance;
    
    // Update user's balances in database
    await query(
      'UPDATE users SET usdt_trc20_balance = ?, usdt_bsc20_balance = ?, balance = ?, last_balance_refresh = NOW() WHERE user_id = ?',
      [trc20Balance, bep20Balance, totalBalance, userId]
    );
    
    return {
      trc20Balance,
      bep20Balance,
      totalBalance
    };
  } catch (error) {
    console.error('Error updating user balances:', error);
    throw error;
  }
}

module.exports = {
  generateWallet,
  getTRC20Balance,
  getBEP20Balance,
  updateUserBalances
};
