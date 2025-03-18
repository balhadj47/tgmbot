const { t } = require('./i18n');
const { userExists, createUser, getUser } = require('./database');
const { generateWallet, updateUserBalances } = require('./wallet');
const { getAllProducts } = require('./products');

// Setup bot commands
function setupCommands(bot) {
  // Start command
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username || '';
    const firstName = msg.from.first_name || '';
    const lastName = msg.from.last_name || '';
    
    try {
      // Check if user exists
      const exists = await userExists(userId);
      
      if (!exists) {
        // Generate wallet for new user
        const wallet = await generateWallet();
        
        // Create new user
        await createUser({
          userId,
          username,
          firstName,
          lastName,
          language: 'en',
          trxAddress: wallet.trxAddress,
          bscAddress: wallet.bscAddress,
          mnemonic: wallet.mnemonic
        });
        
        console.log(`New user registered: ${userId}`);
      }
      
      // Send welcome message with language selection
      bot.sendMessage(chatId, t('welcome'), {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🇺🇸 English', callback_data: 'lang_en' },
              { text: '🇫🇷 Français', callback_data: 'lang_fr' }
            ],
            [
              { text: '🇸🇦 العربية', callback_data: 'lang_ar' }
            ]
          ]
        }
      });
    } catch (error) {
      console.error('Error in start command:', error);
      bot.sendMessage(chatId, 'An error occurred. Please try again.');
    }
  });
  
  // Balance command
  bot.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    try {
      // Update user balances
      const balances = await updateUserBalances(userId);
      
      // Get user data
      const user = await getUser(userId);
      
      if (!user) {
        bot.sendMessage(chatId, 'Please use /start to register first.');
        return;
      }
      
      // Format last refresh time
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
      bot.sendMessage(chatId, 'An error occurred. Please try again.');
    }
  });
  
  // Products command
  bot.onText(/\/products/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
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
      console.error('Error in products command:', error);
      bot.sendMessage(chatId, 'An error occurred. Please try again.');
    }
  });
  
  // Wallet command
  bot.onText(/\/wallet/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    try {
      // Get user data
      const user = await getUser(userId);
      
      if (!user) {
        bot.sendMessage(chatId, 'Please use /start to register first.');
        return;
      }
      
      // Send wallet info
      bot.sendMessage(chatId, t('wallet_info', {
        trx: user.trx_address || 'Not available',
        bsc: user.bsc_address || 'Not available'
      }));
    } catch (error) {
      console.error('Error in wallet command:', error);
      bot.sendMessage(chatId, 'An error occurred. Please try again.');
    }
  });
  
  // Language command
  bot.onText(/\/language/, (msg) => {
    const chatId = msg.chat.id;
    
    // Send language selection
    bot.sendMessage(chatId, t('welcome'), {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🇺🇸 English', callback_data: 'lang_en' },
            { text: '🇫🇷 Français', callback_data: 'lang_fr' }
          ],
          [
            { text: '🇸🇦 العربية', callback_data: 'lang_ar' }
          ]
        ]
      }
    });
  });
  
  // Help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    // Send help message
    bot.sendMessage(chatId, t('help'));
  });
}

module.exports = {
  setupCommands
};
