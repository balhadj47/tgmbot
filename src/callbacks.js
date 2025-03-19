// Callback query handlers
const { t, setLocale } = require('./i18n');
const { getProductById } = require('./products');

// Setup callback query handlers
function setupCallbacks(bot) {
  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    
    try {
      // Language selection
      if (data.startsWith('lang_')) {
        const lang = data.split('_')[1];
        handleLanguageSelection(bot, chatId, lang);
      }
      // Product selection
      else if (data.startsWith('product_')) {
        const productId = parseInt(data.split('_')[1]);
        handleProductSelection(bot, chatId, productId);
      }
      // Refresh balance
      else if (data === 'refresh_balance') {
        handleRefreshBalance(bot, chatId, callbackQuery.from.id);
      }
      
      // Answer callback query
      bot.answerCallbackQuery(callbackQuery.id);
    } catch (error) {
      console.error('Error handling callback query:', error);
      bot.answerCallbackQuery(callbackQuery.id, { text: 'An error occurred' });
    }
  });
}

// Handle language selection
function handleLanguageSelection(bot, chatId, lang) {
  if (setLocale(lang)) {
    bot.sendMessage(chatId, t('welcome'));
  } else {
    bot.sendMessage(chatId, 'Language not supported');
  }
}

// Handle product selection
async function handleProductSelection(bot, chatId, productId) {
  const product = await getProductById(productId);
  
  if (!product) {
    bot.sendMessage(chatId, 'Product not found');
    return;
  }
  
  // Send product details
  bot.sendMessage(chatId, `*${product.name}*\n\n${product.description}\n\nPrice: ${product.price} USDT`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Buy Now', callback_data: `buy_${product.id}` }],
        [{ text: 'Back to Products', callback_data: 'back_products' }]
      ]
    }
  });
}

// Handle refresh balance
async function handleRefreshBalance(bot, chatId, userId) {
  // Mock user balances for development
  const balances = {
    totalBalance: 1000.0,
    trc20Balance: 800.0,
    bep20Balance: 200.0
  };
  
  // Format last refresh time
  const lastRefresh = new Date().toLocaleString();
  
  // Send updated balance message
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
}

module.exports = {
  setupCallbacks
};
