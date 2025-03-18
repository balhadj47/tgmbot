const i18next = require('i18next');

// Initialize i18next
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        welcome: 'Welcome to the Telegram Store! Choose your language:',
        language_changed: 'Language changed successfully!',
        balance: 'Your current balance: {{balance}} USDT\n\nTRC20: {{trc20}} USDT\nBEP20: {{bep20}} USDT\n\nLast updated: {{time}}',
        refresh_balance: 'Balance refreshed!',
        products: 'Available Products:',
        product_details: '🛍️ {{name}}\n\n💰 Price: {{price}} USDT\n\n📝 Description: {{description}}\n\n📦 In stock: {{stock}}',
        buy_success: 'You have successfully purchased {{name}} for {{price}} USDT!',
        insufficient_funds: 'Insufficient funds. Please deposit more USDT.',
        out_of_stock: 'This product is out of stock.',
        error: 'An error occurred. Please try again later.',
        wallet_info: 'Your wallet addresses:\n\nTRC20 (USDT): {{trx}}\n\nBEP20 (USDT): {{bsc}}\n\nSend USDT to these addresses to top up your balance.',
        help: 'Available commands:\n\n/start - Start the bot\n/balance - Check your balance\n/products - View available products\n/wallet - View your wallet addresses\n/language - Change language\n/help - Show this help message'
      }
    },
    fr: {
      translation: {
        welcome: 'Bienvenue dans la boutique Telegram ! Choisissez votre langue:',
        language_changed: 'Langue changée avec succès !',
        balance: 'Votre solde actuel: {{balance}} USDT\n\nTRC20: {{trc20}} USDT\nBEP20: {{bep20}} USDT\n\nDernière mise à jour: {{time}}',
        refresh_balance: 'Solde actualisé !',
        products: 'Produits disponibles:',
        product_details: '🛍️ {{name}}\n\n💰 Prix: {{price}} USDT\n\n📝 Description: {{description}}\n\n📦 En stock: {{stock}}',
        buy_success: 'Vous avez acheté avec succès {{name}} pour {{price}} USDT !',
        insufficient_funds: 'Fonds insuffisants. Veuillez déposer plus d\'USDT.',
        out_of_stock: 'Ce produit est en rupture de stock.',
        error: 'Une erreur s\'est produite. Veuillez réessayer plus tard.',
        wallet_info: 'Vos adresses de portefeuille:\n\nTRC20 (USDT): {{trx}}\n\nBEP20 (USDT): {{bsc}}\n\nEnvoyez de l\'USDT à ces adresses pour recharger votre solde.',
        help: 'Commandes disponibles:\n\n/start - Démarrer le bot\n/balance - Vérifier votre solde\n/products - Voir les produits disponibles\n/wallet - Voir vos adresses de portefeuille\n/language - Changer de langue\n/help - Afficher ce message d\'aide'
      }
    },
    ar: {
      translation: {
        welcome: 'مرحبًا بك في متجر تيليجرام! اختر لغتك:',
        language_changed: 'تم تغيير اللغة بنجاح!',
        balance: 'رصيدك الحالي: {{balance}} USDT\n\nTRC20: {{trc20}} USDT\nBEP20: {{bep20}} USDT\n\nآخر تحديث: {{time}}',
        refresh_balance: 'تم تحديث الرصيد!',
        products: 'المنتجات المتاحة:',
        product_details: '🛍️ {{name}}\n\n💰 السعر: {{price}} USDT\n\n📝 الوصف: {{description}}\n\n📦 متوفر: {{stock}}',
        buy_success: 'لقد اشتريت بنجاح {{name}} مقابل {{price}} USDT!',
        insufficient_funds: 'رصيد غير كافٍ. يرجى إيداع المزيد من USDT.',
        out_of_stock: 'هذا المنتج غير متوفر حاليًا.',
        error: 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.',
        wallet_info: 'عناوين محفظتك:\n\nTRC20 (USDT): {{trx}}\n\nBEP20 (USDT): {{bsc}}\n\nأرسل USDT إلى هذه العناوين لزيادة رصيدك.',
        help: 'الأوامر المتاحة:\n\n/start - بدء البوت\n/balance - التحقق من رصيدك\n/products - عرض المنتجات المتاحة\n/wallet - عرض عناوين محفظتك\n/language - تغيير اللغة\n/help - عرض رسالة المساعدة هذه'
      }
    }
  }
});

// Translation function
function t(key, options = {}) {
  return i18next.t(key, options);
}

// Change language
function changeLanguage(lang) {
  i18next.changeLanguage(lang);
}

module.exports = {
  i18n: i18next,
  t,
  changeLanguage
};
