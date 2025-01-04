const { getUserData, addUserIn, checkUserbyemail } = require("../models/user");
const { v4 : uuidv4 } = require('uuid');
const path = require('path');
const loginViewPath = path.join(__dirname, '../view/login');
const listViewPath = path.join(__dirname, '../view/list');

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

async function registerUser(userdata, res) {

  if (!userdata) {
    return res.status(400).json({ message: "User data is not defined" });
  }

  try {
    const added = await addUserIn(userdata);

    if (added.success) {
      return res.render(loginViewPath, {
        page : 1,
        registered : 1
      } );
    } else if (added.errorCode == 2) {
      return res.render(loginViewPath, {
        page : 2,
        registered : 2,
        message :  added.message
      } );
    } else if (added.errorCode == 3) {
      return res.render(loginViewPath, {
        page : 2,
        registered : 0,
        already : 0,
        message :  "Something went wrong, Please try agin later"
      } );
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function checkUser(userdata, res) {

  if (!userdata) {
    return res.status(400).json({ message: "User data is not defined" });
  }

  try {
    const isuser = await checkUserbyemail(userdata);

    if (isuser.success) {
      return res.render(loginViewPath, {
        page : 1,
        registered : 1
      } );
    } else if (isuser.errorCode == 2) {
      return res.render(loginViewPath, {
        page : 2,
        registered : 2,
        message :  isuser.message
      } );
    } else if (isuser.errorCode == 3) {
      return res.render(loginViewPath, {
        page : 2,
        registered : 0,
        already : 0,
        message :  "Something went wrong, Please try agin later"
      } );
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  allFriends,
  registerUser,
  checkUser
};
