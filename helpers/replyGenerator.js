const translate = require('google-translate-api');

async function generateReply(data, lang, intent) {
  let text = '';

  switch (intent) {
    case 'tracking':
    case 'status':
      text = `Your order ${data.order_id} is currently: ${data.status}. Tracking ID: ${data.trackingid}`;
      break;
    case 'cancel':
      text = `Order ${data.order_id} cannot be cancelled via bot. Please contact support.`;
      break;
    case 'exchange':
      text = `To exchange order ${data.order_id}, please visit our website. Status: ${data.status}`;
      break;
    case 'complaint':
      text = `We're sorry for the inconvenience. Order ${data.order_id} is: ${data.status}. Support will help you soon.`;
      break;
    default:
      text = `Order ${data.order_id} is: ${data.status}. Tracking ID: ${data.trackingid}`;
  }

  if (lang !== 'en') {
    try {
      const translated = await translate(text, { to: lang });
      return translated.text;
    } catch (e) {
      return text;
    }
  }

  return text;
}

module.exports = { generateReply };
