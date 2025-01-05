const jwt = require("jsonwebtoken");
const path = require("path");
const secret = "chatweb@$$123";

function setUser(user) {
  try {
    return jwt.sign(
      {
        id: user.id,
        unique_id: user.unique_id,
        name: user.name,
        email: user.email,
      },
      secret
    );
  } catch (error) {
    return null;
  }
}

function getUser(id) {
  if (!id) return null;
  try {
    return jwt.verify(id, secret);
  } catch (error) {
    return null;
  }
}
function logoutUser(req, res) {
  const token = req.cookies?.uid; 
  if (!token) {
    return res.redirect('/login');
  }
  res.clearCookie("uid");
  console.log("User logged out successfully, token cleared");
  return res.redirect('/login');
}

module.exports = {
  setUser,
  getUser,
  logoutUser,
};
