const { getUserData, addUserIn, loginUser, editUserdata } = require("../models/user");
const path = require("path");
const loginViewPath = path.join(__dirname, "../view/login");
const profilePath = path.join(__dirname, "../view/profile");

const { setUser } = require("../service/auth");

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
        page: 1,
        registered: 1,
      });
    } else if (added.errorCode == 2) {
      return res.render(loginViewPath, {
        page: 2,
        registered: 2,
        message: added.message,
      });
    } else if (added.errorCode == 3) {
      return res.render(loginViewPath, {
        page: 2,
        registered: 0,
        already: 0,
        message: "Something went wrong, Please try agin later",
      });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function checkUser(req, res) {
  const userdata = req.body;
  if (!userdata) {
    return res.status(400).json({ message: "User data is not defined" });
  }

  try {
    const isuser = await loginUser(userdata);
    if (isuser.success) {
      const token = setUser(isuser.data[0]);
      res.cookie("uid", token);
      const user = req.user;
      return res.redirect("/");
    } else {
      return res.render(loginViewPath, {
        page: 1,
        registered: 5,
        message: isuser.message,
      });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function profiledata(req, res) {
  const userdata = req.user;
  if (!userdata) {
    return res.status(400).json({ message: "User data is not defined" });
  }
  const profiledata = {
      _id : userdata.unique_id,
      name: userdata.name,
      email: userdata.email,
      birthdate: userdata.birthdate,
      number: userdata.number
  }

  return res.render(profilePath, profiledata);
}
async function editUserdara(req, res) {
  const userdata = req.body;
  if (!userdata) {
    return res.status(400).json({ message: "User data is not defined" });
  }
  try {
    const added = await editUserdata(userdata);

    if (added.success) {
      return res.render(profilePath, {
        error: 0,
        message: "Successfully updated",
      });
    } else if (added.errorCode == 2) {
      return res.render(profilePath, {
        error: 1,
        message: added.message,
      });
    } else if (added.errorCode == 3) {
      return res.render(profilePath, {
        error: 2,
        message: "Something went wrong, Please try agin later",
      });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {
  allFriends,
  registerUser,
  checkUser,
  profiledata,
  editUserdara
};
