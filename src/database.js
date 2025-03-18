const mysql = require('mysql2/promise');
require('dotenv').config();

// Create an in-memory database for development
const inMemoryDb = {
  users: [],
  products: [],
  deposits: [],
  numbers: []
};

// Mock query function for in-memory database
async function query(sql, params = []) {
  console.log(`Executing query: ${sql}`);
  console.log(`With params: ${params}`);
  
  // Simple mock implementation
  if (sql.includes('CREATE TABLE')) {
    return [[], []];
  }
  
  if (sql.includes('SELECT * FROM users WHERE user_id = ?')) {
    const userId = params[0];
    const user = inMemoryDb.users.find(u => u.user_id === userId);
    return [[user || {}], []];
  }
  
  if (sql.includes('INSERT INTO users')) {
    const userId = params[0];
    inMemoryDb.users.push({
      user_id: userId,
      username: params[1],
      first_name: params[2],
      last_name: params[3],
      language: params[4],
      balance: 0,
      usdt_trc20_balance: 0,
      usdt_bsc20_balance: 0,
      trx_address: params[5],
      bsc_address: params[6],
      mnemonic: params[7],
      created_at: new Date(),
      last_balance_refresh: null
    });
    return [{ insertId: inMemoryDb.users.length }, []];
  }
  
  if (sql.includes('UPDATE users SET')) {
    // Mock update
    return [{ affectedRows: 1 }, []];
  }
  
  // Default empty response
  return [[], []];
}

// Setup database tables if they don't exist
async function setupDatabase() {
  try {
    console.log('Using in-memory database for development');
    
    // Initialize in-memory tables
    inMemoryDb.users = [];
    inMemoryDb.products = [];
    inMemoryDb.deposits = [];
    inMemoryDb.numbers = [];
    
    // Add some sample products
    inMemoryDb.products = [
      {
        id: 1,
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 10.0,
        category: 'Sample',
        stock: 10,
        image_url: '',
        active: true,
        created_at: new Date()
      },
      {
        id: 2,
        name: 'Sample Product 2',
        description: 'Another sample product',
        price: 20.0,
        category: 'Sample',
        stock: 5,
        image_url: '',
        active: true,
        created_at: new Date()
      }
    ];
    
    console.log('In-memory database initialized with sample data');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Check if user exists
async function userExists(userId) {
  const user = inMemoryDb.users.find(u => u.user_id === userId);
  return !!user;
}

// Create a new user
async function createUser(userData) {
  const { userId, username, firstName, lastName, language, trxAddress, bscAddress, mnemonic } = userData;
  
  inMemoryDb.users.push({
    user_id: userId,
    username,
    first_name: firstName,
    last_name: lastName,
    language,
    balance: 0,
    usdt_trc20_balance: 0,
    usdt_bsc20_balance: 0,
    trx_address: trxAddress,
    bsc_address: bscAddress,
    mnemonic,
    created_at: new Date(),
    last_balance_refresh: null
  });
  
  return true;
}

// Get user by ID
async function getUser(userId) {
  return inMemoryDb.users.find(u => u.user_id === userId) || null;
}

module.exports = {
  query,
  setupDatabase,
  userExists,
  createUser,
  getUser
};
