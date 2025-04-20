const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');

router.post('/chatbot/respond', chatbotController.respondToCustomer);

module.exports = router;
