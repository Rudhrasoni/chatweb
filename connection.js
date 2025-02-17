// databaseConnection.js

const mysql = require('mysql2');

// MySQL connection configuration
const connectionConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '12345', 
    database: 'chats_data' 
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
