const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function fetchOrderData(order_id, type = ['status', 'trackingid']) {
  try {
    const response = await axios.post(`${process.env.CAKEPHP_API}/api/getdata`, {
      order_id,
      type
    });
    return response.data;
  } catch (err) {
    console.error('CakePHP API error:', err.message);
    return null;
  }
}

module.exports = { fetchOrderData };
