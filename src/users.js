// User management functionality
const { addUser: dbAddUser, getUserById: dbGetUserById } = require('./database');

// Register user
async function registerUser(telegramUser) {
  try {
    const user = {
      id: telegramUser.id,
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      language: telegramUser.language_code,
      registeredAt: new Date().toISOString(),
      wallet: {
        address: null,
        balance: 0
      }
    };
    
    return dbAddUser(user);
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
}

// Get user by ID
async function getUserById(id) {
  try {
    return dbGetUserById(id);
  } catch (error) {
    console.error(`Error getting user with ID ${id}:`, error);
    return null;
  }
}

module.exports = {
  registerUser,
  getUserById
};
