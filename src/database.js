const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Execute SQL queries
async function query(sql, params) {
  return await pool.execute(sql, params);
}

// Setup database tables if they don't exist
async function setupDatabase() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL UNIQUE,
        username VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        language VARCHAR(10) DEFAULT 'en',
        balance DECIMAL(18, 6) DEFAULT 0,
        usdt_trc20_balance DECIMAL(18, 6) DEFAULT 0,
        usdt_bsc20_balance DECIMAL(18, 6) DEFAULT 0,
        trx_address VARCHAR(255),
        bsc_address VARCHAR(255),
        mnemonic TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_balance_refresh TIMESTAMP,
        INDEX (user_id)
      )
    `);

    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(18, 6) NOT NULL,
        category VARCHAR(100),
        stock INT DEFAULT 0,
        image_url VARCHAR(255),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create deposits table
    await query(`
      CREATE TABLE IF NOT EXISTS deposits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        amount DECIMAL(18, 6) NOT NULL,
        network VARCHAR(10) NOT NULL,
        tx_hash VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (user_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Create numbers table
    await query(`
      CREATE TABLE IF NOT EXISTS numbers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        product_id INT NOT NULL,
        phone_number VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expiry_date TIMESTAMP,
        INDEX (user_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Check if user exists
async function userExists(userId) {
  const [rows] = await query('SELECT * FROM users WHERE user_id = ?', [userId]);
  return rows.length > 0;
}

// Create a new user
async function createUser(userData) {
  const { userId, username, firstName, lastName, language, trxAddress, bscAddress, mnemonic } = userData;
  
  await query(
    'INSERT INTO users (user_id, username, first_name, last_name, language, trx_address, bsc_address, mnemonic) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, username, firstName, lastName, language, trxAddress, bscAddress, mnemonic]
  );
}

// Get user by ID
async function getUser(userId) {
  const [rows] = await query('SELECT * FROM users WHERE user_id = ?', [userId]);
  return rows[0];
}

module.exports = {
  query,
  setupDatabase,
  userExists,
  createUser,
  getUser
};
