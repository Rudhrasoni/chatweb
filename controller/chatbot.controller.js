const { extractOrderId, detectIntent } = require('../helpers/intentParser');
const { detectLanguage } = require('../helpers/languageDetector');
const { fetchOrderData } = require('../services/cakeApi');
const { generateReply } = require('../helpers/replyGenerator');

exports.respondToCustomer = async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ reply: 'Please provide a message' });

  const orderId = extractOrderId(message);
  const intent = detectIntent(message);
  const lang = detectLanguage(message);

  if (!orderId) return res.json({ reply: 'Please include a valid order ID in your message.' });

  const orderData = await fetchOrderData(orderId, ['status', 'trackingid']);
  if (!orderData) return res.json({ reply: 'Unable to fetch your order right now. Try later.' });

  const reply = await generateReply(orderData, lang, intent);
  res.json({ reply });
};
