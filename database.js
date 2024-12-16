const mysql = require('mysql2/promise');
const { getConnection } = require('./connection');
/**
 * Inserts a message into the messages table and assigns it to users using message_assagin table.
 * 
 * @param {string} message - The message to be inserted.
 * @param {number} fromUserId - The user sending the message.
 * @param {number} toUserId - The user receiving the message.
 * @returns {Promise<void>}
 */
async function insertMessageAndAssign(message, fromUserId, toUserId) {
    // Database connection configuration
    

    let connection;
    try {
        // Create a MySQL connection
        connection = await mysql.createConnection(getConnection);
        
        // Start a transaction
        await connection.beginTransaction();

        // Step 1: Insert message into the `messages` table
        const messageSql = 'INSERT INTO messages (message, status) VALUES (?, ?)';
        const [messageResult] = await connection.execute(messageSql, [message, 1]); // 1 for "active" status
        const messageId = messageResult.insertId; // Get the last inserted message ID

        console.log(`Message inserted successfully with ID: ${messageId}`);

        // Step 2: Assign the message to users using `message_assagin` table
        const assignSql = 'INSERT INTO message_assagin (from_user_id, to_user_id, message_id) VALUES (?, ?, ?)';
        const [assignResult] = await connection.execute(assignSql, [fromUserId, toUserId, messageId]);

        console.log('Message assigned successfully:', assignResult);

        // Commit the transaction
        await connection.commit();

    } catch (error) {
        // Rollback if there is any error
        if (connection) {
            await connection.rollback();
        }
        console.error('Error occurred:', error);
    } finally {
        // Close the connection
        if (connection) {
            await connection.end();
        }
    }
}

module.exports = {
    insertMessageAndAssign
};
