const express = require("express");
const router = express.Router();
const { allFriends, registerUser, checkUser  } = require('../controller/user');
const { logoutUser  } = require('../service/auth');

router.use(express.urlencoded({ extended: true }));

router.post("/usersbyid", allFriends);
router.post("/register", async (req, res) => {
    const userdata = req.body;
    await registerUser(userdata, res)
}); 
router.post("/login", async (req, res) => {
    await checkUser(req, res)
});
router.get("/logout", logoutUser);
module.exports = router
