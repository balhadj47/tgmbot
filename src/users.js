const { query } = require('./database');
const { generateWallet } = require('./wallet');
const { t, changeLanguage } = require('./i18n');

// Register a new user or update existing user
async function registerUser(user) {
  try {
    const { id, username, first_name, last_name, language_code } = user;
    
    // Check if user already exists
    const [existingUsers] = await query(
      'SELECT * FROM users WHERE user_id = ?',
      [id]
    );
    
    if (existingUsers.length > 0) {
      // Update existing user
      await query(
        'UPDATE users SET username = ?, first_name = ?, last_name = ? WHERE user_id = ?',
        [username, first_name, last_name, id]
      );
      
      return existingUsers[0];
    } else {
      // Generate wallet for new user
      const wallet = await generateWallet();
      
      // Create new user
      await query(
        'INSERT INTO users (user_id, username, first_name, last_name, language, trx_address, bsc_address, mnemonic) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, username, first_name, last_name, language_code || 'en', wallet.trxAddress, wallet.bscAddress, wallet.mnemonic]
      );
      
      // Get the newly created user
      const [newUser] = await query(
        'SELECT * FROM users WHERE user_id = ?',
        [id]
      );
      
      return newUser[0];
    }
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Get user by Telegram ID
async function getUserById(userId) {
  try {
    const [rows] = await query(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

// Update user language
async function updateUserLanguage(userId, language) {
  try {
    await query(
      'UPDATE users SET language = ? WHERE user_id = ?',
      [language, userId]
    );
    
    // Change i18n language for this user's session
    changeLanguage(language);
    
    return true;
  } catch (error) {
    console.error('Error updating user language:', error);
    throw error;
  }
}

// Get user's transaction history
async function getUserTransactionHistory(userId) {
  try {
    // Get deposits
    const [deposits] = await query(
      'SELECT * FROM deposits WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Get purchases
    const [purchases] = await query(
      `SELECT n.*, p.name as product_name, p.price 
       FROM numbers n 
       JOIN products p ON n.product_id = p.id 
       WHERE n.user_id = ? 
       ORDER BY n.purchase_date DESC`,
      [userId]
    );
    
    return {
      deposits,
      purchases
    };
  } catch (error) {
    console.error('Error getting user transaction history:', error);
    throw error;
  }
}

module.exports = {
  registerUser,
  getUserById,
  updateUserLanguage,
  getUserTransactionHistory
};
