// databaseConnection.js

const mysql = require('mysql2/promise');

// MySQL connection configuration
const connectionConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password
    database: 'chats_data' // Replace with your database name
};

/**
 * Function to get a MySQL database connection
 * @returns {Promise<mysql.Connection>} - Returns a MySQL connection instance
 */
async function getConnection() {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        console.log('Connected to the MySQL database.');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

module.exports = {
    getConnection
};
