function extractOrderId(message) {
    const match = message.match(/\b\d{4,}\b/);
    return match ? match[0] : null;
  }
  
  function detectIntent(message) {
    const lower = message.toLowerCase();
    if (lower.includes('cancel')) return 'cancel';
    if (lower.includes('track') || lower.includes('where') || lower.includes('status')) return 'tracking';
    if (lower.includes('exchange')) return 'exchange';
    if (lower.includes('wrong') || lower.includes('issue') || lower.includes('complaint')) return 'complaint';
    return 'status';
  }
  
  module.exports = { extractOrderId, detectIntent };
  