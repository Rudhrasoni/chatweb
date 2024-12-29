const express = require("express");
const { writeMessages, readAllMessages } = require('../controller/messages')

const router = express.Router();
exports.router = router;

router.post("/write", writeMessages);

router.get("/read", readAllMessages);

router.get("/", (req,res) => {
  res.end('Welcome to api');
});

module.exports = router;
