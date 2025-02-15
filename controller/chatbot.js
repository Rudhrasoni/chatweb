const { getResponse } = require("../models/chatbot");


async function chatResponse(req, res) {
  const userRequest = req.body.message; // Get the message from the request body

  if (!userRequest) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const responseMessage = await getResponse(userRequest);
    return res.json({ response: responseMessage });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
    chatResponse
}