const { t } = require('./i18n');
const { updateUserBalances } = require('./wallet');
const { getAllProducts } = require('./products');

// Setup bot commands
function setupCommands(bot) {
  // Start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, t('welcome'));
  });
  
  // Help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, t('help'));
  });
  
  // Balance command
  bot.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    try {
      // Get user balances
      const balances = await updateUserBalances(userId);
      
      // Format last refresh time
      const lastRefresh = new Date().toLocaleString();
      
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
      console.error('Error getting balance:', error);
      bot.sendMessage(chatId, t('error'));
    }
  });
  
  // Products command
  bot.onText(/\/products/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      // Get all products
      const products = await getAllProducts();
      
      if (products.length === 0) {
        bot.sendMessage(chatId, 'No products available at the moment.');
        return;
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
      console.error('Error getting products:', error);
      bot.sendMessage(chatId, t('error'));
    }
  });
  
  // Language command
  bot.onText(/\/language/, (msg) => {
    const chatId = msg.chat.id;
    
    // Send language selection message
    bot.sendMessage(chatId, t('language_selection'), {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🇬🇧 English', callback_data: 'lang_en' },
            { text: '🇫🇷 Français', callback_data: 'lang_fr' }
          ],
          [
            { text: '🇸🇦 العربية', callback_data: 'lang_ar' }
          ]
        ]
      }
    });
  });
}

module.exports = {
  setupCommands
};
