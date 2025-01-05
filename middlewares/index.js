const fs = require("fs");
const { getUser } = require("../service/auth");

function logRequests(file) {
  return (req, res, next) => {
    fs.appendFile(
      file,
      `${Date.now()}:-> ${req.method}, ${req.path}, ${req.ip}\n`,
      () => {
        next();
      }
    );
  };
}
function checksession() {
  return (req, res, next) => {
    const uid = req.cookies?.uid;
    if (uid) {
      const user = getUser(uid);
      if (user) {
        req.user = user;
        next();
      } else {
        return res.redirect('/login');
      }
    } else {
      return res.redirect('/login');
    }
  };
}
function checkAuth(req, res, next) {
  const uid = req.cookies?.uid;
  const user = getUser(uid);
  req.user = user;
  next();
}

module.exports = {
  logRequests,
  checksession,
  checkAuth
};
