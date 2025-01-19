const jwt = require("jsonwebtoken");
const secret = "chatweb@$$123";
const revokedTokens = new Set(); // Use a database or cache in production

function setUser(user) {
  try {
    return jwt.sign(
      {
        id: user.id,
        unique_id: user.unique_id,
        name: user.name,
        email: user.email,
        birthdate : user.birthdate
      },
      secret,
      {
        expiresIn: "1d",
      }
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
function isTokenRevoked(token) {
  return revokedTokens.has(token);
}
function logoutUser(req, res) {
  const token = req.cookies?.uid;
  revokedTokens.add(token);
  if (!token) {
    return res.redirect("/login");
  }
  res.clearCookie("uid");
  console.log("User logged out successfully, token cleared");
  return res.redirect("/login");
}

function authenticate(req, res, next) {
  const token = req.cookies?.uid;
  if (!token || isTokenRevoked(token)) {
    return res.redirect("/login");
  }

  try {
    const user = jwt.verify(token, secret);
    req.user = user; // Attach user data to the request
    next();
  } catch (error) {
    return res.redirect("/login");
  }
}

module.exports = {
  setUser,
  getUser,
  logoutUser,
};
