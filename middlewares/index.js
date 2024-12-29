const fs = require("fs");
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

module.exports = {
  logRequests,
};
