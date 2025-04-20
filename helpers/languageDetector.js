const franc = require('franc');
const langs = require('langs');

function detectLanguage(text) {
  const langCode = franc(text);
  if (langCode === 'und') return 'en';
  const lang = langs.where('3', langCode);
  return lang ? lang['1'] || 'en' : 'en';
}

module.exports = { detectLanguage };
