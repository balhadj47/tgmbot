require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { setupDatabase } = require('./database');
const { setupCommands } = require('./commands');
const { setupCallbacks } = require('./callbacks');
const { i18n } = require('./i18n');
const { initializeTronWeb } = require('./tronWebWrapper');

// Create Express app
const app = express();
app.use(bodyParser.json());

// Bot configuration
const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('No bot token provided. Please set BOT_TOKEN in your .env file');
  process.exit(1);
}

const webhookUrl = process.env.WEBHOOK_URL || 'https://bot.rifose.com';
const port = process.env.PORT || 3000;

// Create a bot instance with polling instead of webhook for development
const bot = new TelegramBot(token, { polling: true });

async function startBot() {
  try {
    console.log('Starting Telegram Store Bot...');
    
    // Initialize TronWeb with fallback
    console.log('Initializing TronWeb...');
    await initializeTronWeb().catch(err => {
      console.warn('TronWeb initialization warning (continuing with mock):', err.message);
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

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Start Express server
    app.listen(port, () => {
      console.log(`Express server is listening on port ${port}`);
      console.log('Telegram bot started successfully with polling');
    });
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

startBot();
