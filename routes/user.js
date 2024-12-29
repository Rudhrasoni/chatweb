const express = require("express");
const router = express.Router();
const { allFriends } = require('../controller/user');

router.post("/usersbyid", allFriends);

module.exports = router
