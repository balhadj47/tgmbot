const i18next = require('i18next');

// Initialize i18next
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        welcome: 'Welcome to the Telegram Store! 🛍️\nYou can buy products and manage your wallet here.',
        balance: 'Your current balance: {{balance}} USDT\n\nTRC20 Balance: {{trc20}} USDT\nBEP20 Balance: {{bep20}} USDT\n\nLast updated: {{time}}',
        wallet: 'Your wallet addresses:\n\nTRC20 (USDT): `{{trx}}`\n\nBEP20 (USDT): `{{bsc}}`\n\nSend USDT to any of these addresses to top up your balance.',
        products: 'Available Products:',
        product_details: '{{name}}\n\nPrice: {{price}} USDT\nDescription: {{description}}\nStock: {{stock}}',
        buy_success: 'Purchase successful! You bought {{name}} for {{price}} USDT.',
        buy_error: 'Error: {{message}}',
        insufficient_funds: 'Insufficient funds. Please top up your balance.',
        out_of_stock: 'This product is out of stock.',
        language_changed: 'Language changed to English.',
        help: 'Available commands:\n/start - Start the bot\n/balance - Check your balance\n/wallet - View your wallet addresses\n/products - Browse products\n/history - View your purchase history\n/language - Change language\n/help - Show this help message',
        refresh_balance: 'Balance refreshed successfully.',
        history_empty: 'You have no purchase history yet.',
        select_language: 'Please select your language:',
        error: 'An error occurred. Please try again later.'
      }
    },
    fr: {
      translation: {
        welcome: 'Bienvenue dans la boutique Telegram! 🛍️\nVous pouvez acheter des produits et gérer votre portefeuille ici.',
        balance: 'Votre solde actuel: {{balance}} USDT\n\nSolde TRC20: {{trc20}} USDT\nSolde BEP20: {{bep20}} USDT\n\nDernière mise à jour: {{time}}',
        wallet: 'Vos adresses de portefeuille:\n\nTRC20 (USDT): `{{trx}}`\n\nBEP20 (USDT): `{{bsc}}`\n\nEnvoyez des USDT à l\'une de ces adresses pour recharger votre solde.',
        products: 'Produits disponibles:',
        product_details: '{{name}}\n\nPrix: {{price}} USDT\nDescription: {{description}}\nStock: {{stock}}',
        buy_success: 'Achat réussi! Vous avez acheté {{name}} pour {{price}} USDT.',
        buy_error: 'Erreur: {{message}}',
        insufficient_funds: 'Fonds insuffisants. Veuillez recharger votre solde.',
        out_of_stock: 'Ce produit est en rupture de stock.',
        language_changed: 'Langue changée en français.',
        help: 'Commandes disponibles:\n/start - Démarrer le bot\n/balance - Vérifier votre solde\n/wallet - Voir vos adresses de portefeuille\n/products - Parcourir les produits\n/history - Voir votre historique d\'achat\n/language - Changer de langue\n/help - Afficher ce message d\'aide',
        refresh_balance: 'Solde actualisé avec succès.',
        history_empty: 'Vous n\'avez pas encore d\'historique d\'achat.',
        select_language: 'Veuillez sélectionner votre langue:',
        error: 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
      }
    },
    ar: {
      translation: {
        welcome: 'مرحبًا بك في متجر تليجرام! 🛍️\nيمكنك شراء المنتجات وإدارة محفظتك هنا.',
        balance: 'رصيدك الحالي: {{balance}} USDT\n\nرصيد TRC20: {{trc20}} USDT\nرصيد BEP20: {{bep20}} USDT\n\nآخر تحديث: {{time}}',
        wallet: 'عناوين محفظتك:\n\nTRC20 (USDT): `{{trx}}`\n\nBEP20 (USDT): `{{bsc}}`\n\nأرسل USDT إلى أي من هذه العناوين لزيادة رصيدك.',
        products: 'المنتجات المتاحة:',
        product_details: '{{name}}\n\nالسعر: {{price}} USDT\nالوصف: {{description}}\nالمخزون: {{stock}}',
        buy_success: 'تم الشراء بنجاح! لقد اشتريت {{name}} مقابل {{price}} USDT.',
        buy_error: 'خطأ: {{message}}',
        insufficient_funds: 'رصيد غير كافٍ. يرجى زيادة رصيدك.',
        out_of_stock: 'هذا المنتج غير متوفر في المخزون.',
        language_changed: 'تم تغيير اللغة إلى العربية.',
        help: 'الأوامر المتاحة:\n/start - بدء البوت\n/balance - التحقق من رصيدك\n/wallet - عرض عناوين محفظتك\n/products - تصفح المنتجات\n/history - عرض سجل مشترياتك\n/language - تغيير اللغة\n/help - عرض رسالة المساعدة هذه',
        refresh_balance: 'تم تحديث الرصيد بنجاح.',
        history_empty: 'ليس لديك سجل شراء بعد.',
        select_language: 'الرجاء اختيار لغتك:',
        error: 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.'
      }
    }
  }
});

// Function to get translation
function t(key, options = {}) {
  return i18next.t(key, options);
}

// Function to change language
function changeLanguage(lang) {
  i18next.changeLanguage(lang);
}

// Function to get current language
function getCurrentLanguage() {
  return i18next.language;
}

module.exports = {
  i18n: i18next,
  t,
  changeLanguage,
  getCurrentLanguage
};
