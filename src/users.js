const { query } = require('./database');
const { changeLanguage } = require('./i18n');

// Get user by ID
async function getUserById(userId) {
  try {
    const [rows] = await query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Update user language
async function updateUserLanguage(userId, language) {
  try {
    await query(
      'UPDATE users SET language = ? WHERE user_id = ?',
      [language, userId]
    );
    
    // Change i18next language
    changeLanguage(language);
    
    return true;
  } catch (error) {
    console.error('Error updating user language:', error);
    return false;
  }
}

module.exports = {
  getUserById,
  updateUserLanguage
};
