# Telegram Store Bot

A Telegram bot for managing a virtual store with wallet integration.

## Features

- User registration and wallet generation
- Multi-language support (English, French, Arabic)
- Product catalog and purchasing
- Wallet balance management (TRC20 and BEP20)
- Virtual phone number sales

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your configuration
4. Start the bot: `npm start`

## Environment Variables

```
# Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=tgstore

# Blockchain Configuration
TRX_API_KEY=your_tron_api_key
BSC_API_KEY=your_bsc_api_key
```

## Commands

- `/start` - Start the bot
- `/balance` - Check your balance
- `/products` - View available products
- `/wallet` - View your wallet addresses
- `/language` - Change language
- `/help` - Show help message

## Development Notes

- For development, the bot uses an in-memory database
- TronWeb integration is mocked due to ESM compatibility issues
