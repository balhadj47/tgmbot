require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { setupDatabase } = require('./database');
const { setupCommands } = require('./commands');
const { setupCallbacks } = require('./callbacks');
const { i18n } = require('./i18n');
const { initializeTronWeb } = require('./wallet');

// Create a bot instance
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN', { polling: true });

async function startBot() {
  try {
    console.log('Starting Telegram Store Bot...');
    
    // Initialize TronWeb
    console.log('Initializing TronWeb...');
    await initializeTronWeb().catch(err => {
      console.warn('TronWeb initialization warning (continuing anyway):', err.message);
    });
    
    // Initialize database
    console.log('Setting up database...');
    await setupDatabase();
    console.log('Database connected successfully');

    // Setup bot commands
    console.log('Setting up bot commands...');
    setupCommands(bot);
    
    // Setup callback query handlers
    console.log('Setting up callback handlers...');
    setupCallbacks(bot);

    console.log('Telegram bot started successfully');
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

startBot();
