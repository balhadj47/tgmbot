const { t, changeLanguage } = require('./i18n');
const { registerUser, getUserById, updateUserLanguage, getUserTransactionHistory } = require('./users');
const { updateUserBalances } = require('./wallet');
const { getAllProducts, getProductById, purchaseProduct, getUserNumbers } = require('./products');

// Setup bot commands
function setupCommands(bot) {
  // Start command
  bot.onText(/\/start/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const user = await registerUser(msg.from);
      
      // Set user language
      if (user.language) {
        changeLanguage(user.language);
      }
      
      // Send welcome message
      bot.sendMessage(chatId, t('welcome'), {
        reply_markup: {
          keyboard: [
            [{ text: '💰 Balance' }, { text: '👛 Wallet' }],
            [{ text: '🛒 Products' }, { text: '📜 History' }],
            [{ text: '🌐 Language' }, { text: '❓ Help' }]
          ],
          resize_keyboard: true
        }
      });
    } catch (error) {
      console.error('Error in start command:', error);
      bot.sendMessage(msg.chat.id, t('error'));
    }
  });

  // Balance command
  bot.onText(/\/balance|💰 Balance/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      // Update user balances
      const balances = await updateUserBalances(userId);
      
      // Format last refresh time
      const user = await getUserById(userId);
      const lastRefresh = user.last_balance_refresh 
        ? new Date(user.last_balance_refresh).toLocaleString() 
        : 'Never';
      
      // Send balance message
      bot.sendMessage(chatId, t('balance', {
        balance: balances.totalBalance.toFixed(6),
        trc20: balances.trc20Balance.toFixed(6),
        bep20: balances.bep20Balance.toFixed(6),
        time: lastRefresh
      }), {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔄 Refresh Balance', callback_data: 'refresh_balance' }]
          ]
        }
      });
    } catch (error) {
      console.error('Error in balance command:', error);
      bot.sendMessage(msg.chat.id, t('error'));
    }
  });

  // Wallet command
  bot.onText(/\/wallet|👛 Wallet/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      // Get user wallet addresses
      const user = await getUserById(userId);
      
      if (!user) {
        return bot.sendMessage(chatId, t('error'));
      }
      
      // Send wallet message
      bot.sendMessage(chatId, t('wallet', {
        trx: user.trx_address,
        bsc: user.bsc_address
      }), {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('Error in wallet command:', error);
      bot.sendMessage(msg.chat.id, t('error'));
    }
  });

  // Products command
  bot.onText(/\/products|🛒 Products/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      
      // Get all products
      const products = await getAllProducts();
      
      if (products.length === 0) {
        return bot.sendMessage(chatId, 'No products available at the moment.');
      }
      
      // Send products message
      bot.sendMessage(chatId, t('products'), {
        reply_markup: {
          inline_keyboard: products.map(product => [
            { text: `${product.name} - ${product.price} USDT`, callback_data: `product_${product.id}` }
          ])
        }
      });
    } catch (error) {
      console.error('Error in products command:', error);
      bot.sendMessage(msg.chat.id, t('error'));
    }
  });

  // History command
  bot.onText(/\/history|📜 History/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      // Get user transaction history
      const history = await getUserTransactionHistory(userId);
      
      if (history.purchases.length === 0 && history.deposits.length === 0) {
        return bot.sendMessage(chatId, t('history_empty'));
      }
      
      // Format purchases
      let message = '📜 *Transaction History*\n\n';
      
      if (history.purchases.length > 0) {
        message += '*Purchases:*\n';
        history.purchases.forEach((purchase, index) => {
          if (index < 5) { // Limit to 5 most recent purchases
            const date = new Date(purchase.purchase_date).toLocaleDateString();
            message += `${date}: ${purchase.product_name} - ${purchase.price} USDT\n`;
          }
        });
      }
      
      if (history.deposits.length > 0) {
        message += '\n*Deposits:*\n';
        history.deposits.forEach((deposit, index) => {
          if (index < 5) { // Limit to 5 most recent deposits
            const date = new Date(deposit.created_at).toLocaleDateString();
            message += `${date}: ${deposit.amount} USDT (${deposit.network}) - ${deposit.status}\n`;
          }
        });
      }
      
      // Send history message
      bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('Error in history command:', error);
      bot.sendMessage(msg.chat.id, t('error'));
    }
  });

  // Language command
  bot.onText(/\/language|🌐 Language/, (msg) => {
    try {
      const chatId = msg.chat.id;
      
      // Send language selection message
      bot.sendMessage(chatId, t('select_language'), {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🇺🇸 English', callback_data: 'lang_en' },
              { text: '🇫🇷 Français', callback_data: 'lang_fr' },
              { text: '🇸🇦 العربية', callback_data: 'lang_ar' }
            ]
          ]
        }
      });
    } catch (error) {
      console.error('Error in language command:', error);
      bot.sendMessage(msg.chat.id, t('error'));
    }
  });

  // Help command
  bot.onText(/\/help|❓ Help/, (msg) => {
    try {
      const chatId = msg.chat.id;
      
      // Send help message
      bot.sendMessage(chatId, t('help'));
    } catch (error) {
      console.error('Error in help command:', error);
      bot.sendMessage(msg.chat.id, t('error'));
    }
  });

  // Handle text messages that don't match commands
  bot.on('message', (msg) => {
    // Skip messages that are commands or handled by other handlers
    if (msg.text && !msg.text.startsWith('/') && 
        !['💰 Balance', '👛 Wallet', '🛒 Products', '📜 History', '🌐 Language', '❓ Help'].includes(msg.text)) {
      bot.sendMessage(msg.chat.id, t('help'));
    }
  });
}

module.exports = {
  setupCommands
};
