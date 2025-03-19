const { db } = require('./database');
const { initializeTronWeb } = require('./tronWebWrapper');
const { ethers } = require('ethers');

// USDT contract addresses
const USDT_TRC20_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // Tron USDT
const USDT_BEP20_CONTRACT = '0x55d398326f99059fF775485246999027B3197955'; // BSC USDT

// ABI for ERC20 tokens (simplified)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

// Initialize providers
let tronWeb = null;
let bscProvider = null;

async function initializeTronWeb() {
  try {
    const TronWeb = require('tronweb');
    tronWeb = new TronWeb({
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

function initializeBscProvider() {
  try {
    // Use BSC RPC endpoint
    bscProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    console.log('BSC provider initialized successfully');
    return bscProvider;
  } catch (error) {
    console.error('Error initializing BSC provider:', error);
    throw error;
  }
}

async function getTrc20Balance(address) {
  try {
    if (!tronWeb) {
      await initializeTronWeb();
    }
    
    // Get USDT contract instance
    const contract = await tronWeb.contract().at(USDT_TRC20_CONTRACT);
    
    // Call balanceOf function
    const balance = await contract.balanceOf(address).call();
    
    // Convert from smallest unit (6 decimals for USDT)
    return parseFloat(tronWeb.fromSun(balance)) / 1000000;
  } catch (error) {
    console.error('Error getting TRC20 balance:', error);
    return 0;
  }
}

async function getBep20Balance(address) {
  try {
    if (!bscProvider) {
      initializeBscProvider();
    }
    
    // Get USDT contract instance
    const contract = new ethers.Contract(USDT_BEP20_CONTRACT, ERC20_ABI, bscProvider);
    
    // Call balanceOf function
    const balance = await contract.balanceOf(address);
    
    // Convert from smallest unit (18 decimals for BEP20 USDT)
    return parseFloat(ethers.utils.formatUnits(balance, 18));
  } catch (error) {
    console.error('Error getting BEP20 balance:', error);
    return 0;
  }
}

async function updateUserBalances(userId) {
  try {
    // Find user in database
    let user = db.users.find(u => u.id === userId);
    
    // If user doesn't exist, create a new one
    if (!user) {
      user = {
        id: userId,
        trc20_address: '',
        bep20_address: '',
        language: 'en',
        last_balance_refresh: null
      };
      db.users.push(user);
    }
    
    // For development, use mock balances if addresses are empty
    let trc20Balance = 0;
    let bep20Balance = 0;
    
    if (!user.trc20_address) {
      trc20Balance = 100; // Mock balance
    } else {
      trc20Balance = await getTrc20Balance(user.trc20_address);
    }
    
    if (!user.bep20_address) {
      bep20Balance = 50; // Mock balance
    } else {
      bep20Balance = await getBep20Balance(user.bep20_address);
    }
    
    // Update last refresh time
    user.last_balance_refresh = new Date();
    
    // Return balances
    return {
      trc20Balance,
      bep20Balance,
      totalBalance: trc20Balance + bep20Balance
    };
  } catch (error) {
    console.error('Error updating user balances:', error);
    throw error;
  }
}

module.exports = {
  initializeTronWeb,
  updateUserBalances
};
