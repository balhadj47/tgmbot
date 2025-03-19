const { db } = require('./database');

// Get user by ID
async function getUserById(id) {
  let user = db.users.find(u => u.id === id);
  
  // If user doesn't exist, create a new one
  if (!user) {
    user = {
      id,
      trc20_address: '',
      bep20_address: '',
      language: 'en',
      last_balance_refresh: null
    };
    db.users.push(user);
  }
  
  return user;
}

// Update user language
async function updateUserLanguage(userId, language) {
  const user = await getUserById(userId);
  user.language = language;
  return user;
}

// Set user wallet address
async function setUserWalletAddress(userId, chain, address) {
  const user = await getUserById(userId);
  
  if (chain === 'trc20') {
    user.trc20_address = address;
  } else if (chain === 'bep20') {
    user.bep20_address = address;
  }
  
  return user;
}

module.exports = {
  getUserById,
  updateUserLanguage,
  setUserWalletAddress
};
