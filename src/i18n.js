const i18next = require('i18next');

// Initialize i18next
i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        welcome: 'Welcome to the Telegram Store! 🛍️\nUse /help to see available commands.',
        help: 'Available commands:\n/start - Start the bot\n/balance - Check your balance\n/products - View available products\n/language - Change language\n/help - Show this help message',
        language_selection: 'Please select your preferred language:',
        language_changed: 'Language changed successfully!',
        balance: 'Your current balance: {{balance}} USDT\n\nTRC20: {{trc20}} USDT\nBEP20: {{bep20}} USDT\n\nLast updated: {{time}}',
        products: 'Available Products:',
        product_details: '🛍️ {{name}}\n\n💰 Price: {{price}} USDT\n📝 {{description}}\n\n📦 In stock: {{stock}}',
        buy_success: 'Purchase successful!\nYou bought {{name}} for {{price}} USDT.',
        insufficient_funds: 'Insufficient funds. Please top up your balance.',
        out_of_stock: 'This product is out of stock.',
        refresh_balance: 'Balance refreshed!',
        error: 'An error occurred. Please try again later.'
      }
    },
    fr: {
      translation: {
        welcome: 'Bienvenue à la Boutique Telegram! 🛍️\nUtilisez /help pour voir les commandes disponibles.',
        help: 'Commandes disponibles:\n/start - Démarrer le bot\n/balance - Vérifier votre solde\n/products - Voir les produits disponibles\n/language - Changer de langue\n/help - Afficher ce message d\'aide',
        language_selection: 'Veuillez sélectionner votre langue préférée:',
        language_changed: 'Langue changée avec succès!',
        balance: 'Votre solde actuel: {{balance}} USDT\n\nTRC20: {{trc20}} USDT\nBEP20: {{bep20}} USDT\n\nDernière mise à jour: {{time}}',
        products: 'Produits disponibles:',
        product_details: '🛍️ {{name}}\n\n💰 Prix: {{price}} USDT\n📝 {{description}}\n\n📦 En stock: {{stock}}',
        buy_success: 'Achat réussi!\nVous avez acheté {{name}} pour {{price}} USDT.',
        insufficient_funds: 'Fonds insuffisants. Veuillez recharger votre solde.',
        out_of_stock: 'Ce produit est en rupture de stock.',
        refresh_balance: 'Solde actualisé!',
        error: 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
      }
    },
    ar: {
      translation: {
        welcome: 'مرحبًا بك في متجر تيليجرام! 🛍️\nاستخدم /help لرؤية الأوامر المتاحة.',
        help: 'الأوامر المتاحة:\n/start - بدء البوت\n/balance - التحقق من رصيدك\n/products - عرض المنتجات المتاحة\n/language - تغيير اللغة\n/help - عرض رسالة المساعدة هذه',
        language_selection: 'يرجى اختيار لغتك المفضلة:',
        language_changed: 'تم تغيير اللغة بنجاح!',
        balance: 'رصيدك الحالي: {{balance}} USDT\n\nTRC20: {{trc20}} USDT\nBEP20: {{bep20}} USDT\n\nآخر تحديث: {{time}}',
        products: 'المنتجات المتاحة:',
        product_details: '🛍️ {{name}}\n\n💰 السعر: {{price}} USDT\n📝 {{description}}\n\n📦 متوفر: {{stock}}',
        buy_success: 'تم الشراء بنجاح!\nلقد اشتريت {{name}} مقابل {{price}} USDT.',
        insufficient_funds: 'رصيد غير كافٍ. يرجى إعادة شحن رصيدك.',
        out_of_stock: 'هذا المنتج غير متوفر حاليًا.',
        refresh_balance: 'تم تحديث الرصيد!',
        error: 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.'
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
