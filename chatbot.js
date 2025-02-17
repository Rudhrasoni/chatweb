const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Create an express app
const app = express();
const port = 3009;

// Body parser middleware
app.use(bodyParser.json());

// Set up MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'new-database' // Your database name
});

// Function to get the response based on keyword matches
async function getResponse(request) {
  // Split the request into individual keywords
  const keywords = request.split(' ');
    
  // Create a query to search the keywords in the kewords_assgin table
  const query = `
    SELECT ka.keyword, ka.response_id, COUNT(ka.keyword) AS match_count
    FROM kewords_assgin ka
    WHERE ka.keyword IN (?) 
    GROUP BY ka.response_id
    ORDER BY match_count DESC
    LIMIT 1
  `;

  // Query to fetch the response for the most matched keyword
  const [results] = await pool.promise().query(query, [keywords]);

  if (results.length > 0) {
    const responseId = results[0].response_id;
    // Get the response message based on the response_id
    const responseQuery = `SELECT message FROM responses WHERE id = ?`;
    const [responseResults] = await pool.promise().query(responseQuery, [responseId]);

    if (responseResults.length > 0) {
      return responseResults[0].message;
    } else {
      return 'No response found for this request.';
    }
  } else {
    return 'No keywords matched. Please try again with different words.';
  }
}

// API endpoint to handle user requests
app.get("/", (req, res) => {
    return res.status(200).json({ message: 'Hello, Welcome to my Api' });
})
app.post('/chatbot', async (req, res) => {
  const userRequest = req.body.message; // Get the message from the request body
  
  if (!userRequest) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const responseMessage = await getResponse(userRequest);
    return res.json({ response: responseMessage });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
