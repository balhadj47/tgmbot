require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { setupDatabase } = require('./database');
const { setupCommands } = require('./commands');
const { setupCallbacks } = require('./callbacks');
const { i18n } = require('./i18n');
const { initializeTronWeb } = require('./wallet');

// Create Express app
const app = express();
app.use(bodyParser.json());

// Bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const webhookUrl = 'https://bot.rifose.com';
const port = process.env.PORT || 3000;

// Create a bot instance with webhook
const bot = new TelegramBot(token, { webHook: { port } });

async function startBot() {
  try {
    console.log('Starting Telegram Store Bot...');
    
    // Set webhook
    await bot.setWebHook(`${webhookUrl}/bot${token}`);
    console.log(`Webhook set to: ${webhookUrl}/bot${token}`);
    
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

    // Webhook endpoint
    app.post(`/bot${token}`, (req, res) => {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Start Express server
    app.listen(port, () => {
      console.log(`Express server is listening on port ${port}`);
      console.log('Telegram bot started successfully with webhook');
    });
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

startBot();
