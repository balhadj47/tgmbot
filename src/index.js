require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { setupDatabase } = require('./database');
const { setupCommands } = require('./commands');
const { setupCallbacks } = require('./callbacks');
const { i18n } = require('./i18n');

// Create a bot instance
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

async function startBot() {
  try {
    // Initialize database
    await setupDatabase();
    console.log('Database connected successfully');

    // Setup bot commands
    setupCommands(bot);
    
    // Setup callback query handlers
    setupCallbacks(bot);

    console.log('Telegram bot started successfully');
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

startBot();
