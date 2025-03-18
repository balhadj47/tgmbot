# Telegram Store

A Telegram bot that allows users to manage their profiles, check wallet balances, and purchase products.

## Features

- User registration and profile management
- Wallet balance checking (USDT on TRC20 and BEP20 networks)
- Product browsing and purchasing
- Multi-language support (English, French, Arabic)
- Transaction history tracking

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your configuration (see `.env.example`)
4. Start the bot with `npm start`

## Environment Variables

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from BotFather
- `DB_HOST`: MySQL database host
- `DB_USER`: MySQL database user
- `DB_PASSWORD`: MySQL database password
- `DB_NAME`: MySQL database name (default: tgstore)
- `TRX_API_KEY`: TRON API key for TRC20 operations
- `BSC_API_KEY`: BSC API key for BEP20 operations

## Database Schema

The database consists of four main tables:

1. `users`: Stores user information and wallet details
2. `products`: Stores product information and availability
3. `deposits`: Tracks user deposits (USDT transactions)
4. `numbers`: Stores phone numbers and associated product details

## Commands

- `/start`: Start the bot and register
- `/balance`: Check your wallet balance
- `/wallet`: View your wallet addresses
- `/products`: Browse available products
- `/history`: View your transaction history
- `/language`: Change language
- `/help`: Show help message

## License

MIT
