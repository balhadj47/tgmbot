// Internationalization support
const i18n = {
  locales: ['en', 'fr', 'ar'],
  defaultLocale: 'en',
  translations: {
    en: {
      welcome: 'Welcome to the Telegram Store Bot! Use /help to see available commands.',
      help: 'Available commands:\n/start - Start the bot\n/help - Show this help message\n/products - Browse products\n/balance - Check your balance\n/language - Change language',
      balance: 'Your current balance: {{balance}} USDT\nTRC20: {{trc20}} USDT\nBEP20: {{bep20}} USDT\nLast updated: {{time}}',
      products: 'Available products:',
      language_selection: 'Please select your preferred language:',
      error: 'An error occurred. Please try again later.'
    },
    fr: {
      welcome: 'Bienvenue sur le Bot de la Boutique Telegram ! Utilisez /help pour voir les commandes disponibles.',
      help: 'Commandes disponibles :\n/start - Démarrer le bot\n/help - Afficher ce message d\'aide\n/products - Parcourir les produits\n/balance - Vérifier votre solde\n/language - Changer de langue',
      balance: 'Votre solde actuel : {{balance}} USDT\nTRC20 : {{trc20}} USDT\nBEP20 : {{bep20}} USDT\nDernière mise à jour : {{time}}',
      products: 'Produits disponibles :',
      language_selection: 'Veuillez sélectionner votre langue préférée :',
      error: 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
    },
    ar: {
      welcome: 'مرحبًا بك في بوت متجر تيليجرام! استخدم /help لرؤية الأوامر المتاحة.',
      help: 'الأوامر المتاحة:\n/start - بدء البوت\n/help - عرض رسالة المساعدة هذه\n/products - تصفح المنتجات\n/balance - التحقق من رصيدك\n/language - تغيير اللغة',
      balance: 'رصيدك الحالي: {{balance}} USDT\nTRC20: {{trc20}} USDT\nBEP20: {{bep20}} USDT\nآخر تحديث: {{time}}',
      products: 'المنتجات المتاحة:',
      language_selection: 'الرجاء اختيار لغتك المفضلة:',
      error: 'حدث خطأ. الرجاء المحاولة مرة أخرى لاحقًا.'
    }
  },
  currentLocale: 'en'
};

// Translate function
function t(key, params = {}) {
  const translation = i18n.translations[i18n.currentLocale][key] || i18n.translations[i18n.defaultLocale][key] || key;
  
  // Replace parameters
  return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
    return params[param] !== undefined ? params[param] : match;
  });
}

// Set locale
function setLocale(locale) {
  if (i18n.locales.includes(locale)) {
    i18n.currentLocale = locale;
    return true;
  }
  return false;
}

module.exports = {
  i18n,
  t,
  setLocale
};
