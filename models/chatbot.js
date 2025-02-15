const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'new-database'
});

async function getResponse(request) {
  const keywords = request.split(' ');
  console.log(keywords)

  const query = `
    SELECT ka.keyword, ka.response_id, COUNT(ka.keyword) AS match_count
    FROM kewords_assgin ka
    WHERE ka.keyword IN (?) 
    GROUP BY ka.response_id
    ORDER BY match_count DESC
    LIMIT 1
  `;

  const [results] = await pool.promise().query(query, [keywords]);

  if (results.length > 0) {
    const responseId = results[0].response_id;
    const responseQuery = `SELECT message FROM responses WHERE id = ?`;
    const [responseResults] = await pool.promise().query(responseQuery, [responseId]);

    if (responseResults.length > 0) {
      return responseResults[0].message;
    } else {
      return 'No response found for this request.';
    }
  } else {
    return `Sorry i didn't understand.`;
  }
}

module.exports = {
    getResponse
}