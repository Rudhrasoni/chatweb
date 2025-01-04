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
async function addUserIn(params) {
  const userdata = params;
  const uniqueid = Math.floor(Math.random() * 1000000000000) + 1;
  const connection = await getConnection(); 

  try {
    const checkEmailSQL = `SELECT COUNT(*) as count FROM user_data WHERE email = ?`;
    const [emailExists] = await new Promise((resolve, reject) => {
      connection.query(checkEmailSQL, [userdata.email], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (emailExists.count > 0) {
      return { success: false, errorCode : 2, message: "Email already exists!" };
    }

    const userInsertSQL = `INSERT INTO users (unique_id, encripted_id) VALUES ?`;
    const userInsertValues = [[uniqueid, ""]];
    const userResult = await new Promise((resolve, reject) => {
      connection.query(userInsertSQL, [userInsertValues], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const userId = userResult.insertId;

    const userDataInsertSQL = `INSERT INTO user_data (user_id, name, number, address, birthdate, email, status) VALUES ?`;
    const userDataInsertValues = [
      [
        userId,
        userdata.username,
        userdata.number,
        userdata.address,
        userdata.birthdate,
        userdata.email,
        1,
      ],
    ];
    await new Promise((resolve, reject) => {
      connection.query(userDataInsertSQL, [userDataInsertValues], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    return { success: true, errorCode : 0, message: "User added successfully!" };
  } catch (err) {
    console.error("Error adding user:", err);
    return { success: false, errorCode : 1, message: "Error " + err };
    throw err; 
  } finally {
  }
}
async function checkUserbyemail(params) {
  const userdata = params;
  const connection = await getConnection(); 

  try {
    const checkEmailSQL = `SELECT COUNT(*) as count user_data, user_data.id FROM user_data WHERE name = ? AND password = ?`;
    const user = await new Promise((resolve, reject) => {
      connection.query(checkEmailSQL, [userdata.username, userdata.password], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (emailExists) {
      return { success: true, data : user, message: "Welcome" };
    }  else {
      return { success: fales, data : {}, message: "User Name or Password doesnot match" };
    }
  } catch (err) {
    console.error("Error adding user:", err);
    return { success: false, errorCode : 1, message: "Error " + err };
    throw err; 
  } finally {
  }
} 
module.exports = {
  getUserData,addUserIn, checkUserbyemail
};
