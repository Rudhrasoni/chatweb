const express = require("express");
const router = express.Router();
const { allFriends, registerUser, checkUser, profiledata, editUserdara  } = require('../controller/user');
const { logoutUser  } = require('../service/auth');

router.use(express.urlencoded({ extended: true }));

router.post("/usersbyid", allFriends);
router.get('/profile', profiledata)
router.post('/profile', editUserdara)
router.post("/register", async (req, res) => {
    const userdata = req.body;
    await registerUser(userdata, res)
}); 
router.post("/login", async (req, res) => {
    await checkUser(req, res)
});
router.get("/logout", logoutUser);
module.exports = router
