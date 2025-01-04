const express = require("express");
const router = express.Router();
const { allFriends, registerUser, checkUser  } = require('../controller/user');
router.use(express.urlencoded({ extended: true }));

router.post("/usersbyid", allFriends);
router.post("/register", async (req, res) => {
    const userdata = req.body;
    await registerUser(userdata, res)
}); 
router.post("/login", async (req, res) => {
    const userdata = req.body;
    await checkUser(userdata, res)
});


module.exports = router
