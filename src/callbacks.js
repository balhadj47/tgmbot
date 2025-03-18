const { t, changeLanguage } = require('./i18n');
const { updateUserLanguage, getUserById } = require('./users');
const { getProductById, purchaseProduct } = require('./products');
const { updateUserBalances } = require('./wallet');

// Setup callback query handlers
function setupCallbacks(bot) {
  bot.on('callback_query', async (callbackQuery) => {
    try {
      const chatId = callbackQuery.message.chat.id;
      const userId = callbackQuery.from.id;
      const data = callbackQuery.data;
      
      // Language selection
      if (data.startsWith('lang_')) {
        const language = data.split('_')[1];
        await updateUserLanguage(userId, language);
        
        // Send confirmation message
        bot.answerCallbackQuery(callbackQuery.id);
        bot.sendMessage(chatId, t('language_changed'));
      }
      
      // Product details
      else if (data.startsWith('product_')) {
        const productId = parseInt(data.split('_')[1]);
        const product = await getProductById(productId);
        
        if (!product) {
          bot.answerCallbackQuery(callbackQuery.id, { text: 'Product not found' });
          return;
        }
        
        // Send product details
        bot.answerCallbackQuery(callbackQuery.id);
        bot.sendMessage(chatId, t('product_details', {
          name: product.name,
          price: product.price,
          description: product.description,
          stock: product.stock
        }), {
          reply_markup: {
            inline_keyboard: [
              [{ text: `🛒 Buy for ${product.price} USDT`, callback_data: `buy_${productId}` }],
              [{ text: '« Back to Products', callback_data: 'products_list' }]
            ]
          }
        });
      }
      
      // Buy product
      else if (data.startsWith('buy_')) {
        const productId = parseInt(data.split('_')[1]);
        
        try {
          // Attempt to purchase the product
          const result = await purchaseProduct(userId, productId);
          const product = await getProductById(productId);
          
          // Send success message
          bot.answerCallbackQuery<boltAction type="file" filePath="src/callbacks.js">          // Send success message
          bot.answerCallbackQuery(callbackQuery.id, { text: 'Purchase successful!' });
          bot.sendMessage(chatId, t('buy_success', {
            name: product.name,
            price: product.price
          }));
        } catch (error) {
          // Handle purchase errors
          let errorMessage = error.message;
          
          if (error.message.includes('Insufficient balance')) {
            errorMessage = t('insufficient_funds');
          } else if (error.message.includes('out of stock')) {
            errorMessage = t('out_of_stock');
          }
          
          bot.answerCallbackQuery(callbackQuery.id, { text: errorMessage, show_alert: true });
        }
      }
      
      // Refresh balance
      else if (data === 'refresh_balance') {
        // Update user balances
        const balances = await updateUserBalances(userId);
        
        // Format last refresh time
        const user = await getUserById(userId);
        const lastRefresh = user.last_balance_refresh 
          ? new Date(user.last_balance_refresh).toLocaleString() 
          : 'Never';
        
        // Send updated balance message
        bot.answerCallbackQuery(callbackQuery.id, { text: t('refresh_balance') });
        bot.editMessageText(t('balance', {
          balance: balances.totalBalance.toFixed(6),
          trc20: balances.trc20Balance.toFixed(6),
          bep20: balances.bep20Balance.toFixed(6),
          time: lastRefresh
        }), {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔄 Refresh Balance', callback_data: 'refresh_balance' }]
            ]
          }
        });
      }
      
      // Back to products list
      else if (data === 'products_list') {
        const products = await getAllProducts();
        
        if (products.length === 0) {
          bot.answerCallbackQuery(callbackQuery.id);
          bot.editMessageText('No products available at the moment.', {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id
          });
          return;
        }
        
        // Send products message
        bot.answerCallbackQuery(callbackQuery.id);
        bot.editMessageText(t('products'), {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: {
            inline_keyboard: products.map(product => [
              { text: `${product.name} - ${product.price} USDT`, callback_data: `product_${product.id}` }
            ])
          }
        });
      }
    } catch (error) {
      console.error('Error handling callback query:', error);
      bot.answerCallbackQuery(callbackQuery.id, { text: t('error'), show_alert: true });
    }
  });
}

module.exports = {
  setupCallbacks
};
