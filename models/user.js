const { getConnection } = require("../connection");


async function getUserData(params) {
    const userid = params;
    try {
      const connection = await getConnection();
      const sql = `SELECT DISTINCT us.id, usd.name, us.unique_id 
          FROM friends fr
          JOIN users us ON fr.friend_id = us.id
          JOIN user_data usd ON us.id = usd.user_id
          WHERE fr.user_id = ${userid};
          `;
      const result = new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  
module.exports = {
    getUserData,
};