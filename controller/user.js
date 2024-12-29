const { getUserData } = require("../models/user");


async function allFriends(req, res) {
    const userid = req.body.data;
  if (userid != "" && userid != undefined) {
    try {
      const userData = await getUserData(userid);
      if (userData) {
        return res.json(userData);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(404).json({ message: "User id is not Defiend" });
  }
}

module.exports = {
    allFriends
}
