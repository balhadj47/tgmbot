# Telegram Store Bot

A Telegram bot for an online store with cryptocurrency payments.

## Features

- Multi-language support (English, French, Arabic)
- Product catalog browsing
- Cryptocurrency wallet integration (TRC20, BEP20)
- Balance checking
- Secure payment processing

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` file
4. Start the bot: `npm start`

## Environment Variables

```
DB_HOST=127.0.0.1
DB_USER=tgstore
DB_PASSWORD=tgstore
DB_DATABASE=tgstore1

# Bot Configuration
BOT_TOKEN=your_telegram_bot_token
ADMIN_USER_ID=your_admin_user_id

# Blockchain Configuration
BSC_RPC_URL=https://bsc-dataseed.binance.org/
TRON_RPC_URL=https://api.trongrid.io
```

## Commands

- `/start` - Start the bot
- `/help` - Show help message
- `/balance` - Check your balance
- `/products` - Browse available products
- `/language` - Change language

## Development

Run in development mode with hot reloading:

```
npm run dev
```
