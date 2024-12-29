const { getConnection } = require("../connection");

function parseInput(input) {
  const delimiter = "|^|";
  const [userId, encodedContent, timestamp] = input.split(delimiter);
  const content = decodeURIComponent(encodedContent);
  return {
    userId: parseInt(userId, 10),
    content,
    timestamp: timestamp.trim(),
  };
}

async function insertMessageAndAssign(input) {
  const chats = input
    .split(",")
    .map((chat) => chat.trim())
    .filter(Boolean);

  try {
    const connection = await getConnection();

    for (const chat of chats) {
      try {
        const { userId, content, timestamp } = parseInput(chat);

        // Insert message into 'messages' table
        const [messageResult] = await connection.execute(
          "INSERT INTO messages (message, status) VALUES (?, ?)",
          [content, 1]
        );

        const messageId = messageResult.insertId;

        await connection.execute(
          "INSERT INTO message_assagin (from_user_id, to_user_id, message_id) VALUES (?, ?, ?)",
          [userId, userId, messageId] // Assuming `from_user_id` and `to_user_id` are the same here
        );

        console.log(
          `Successfully inserted message: "${content}" with message ID: ${messageId}`
        );
      } catch (error) {
        console.error(`Error processing chat: "${chat}"`, error);
      }
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

module.exports = {
  insertMessageAndAssign,
};
