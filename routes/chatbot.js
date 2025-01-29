const express = require("express");
const { chatResponse } = require('../controller/chatbot')

const router = express.Router();
exports.router = router;

router.post("/chatbot", chatResponse);

router.get("/chatbot", (req, res) => {
    return res.render("chatbot"); 
});

router.get("/", (req,res) => {
  res.end('Welcome to api');
});

module.exports = router;
