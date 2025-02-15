const express = require("express");
const { uploadFile } = require('../controller/filemanage');

const router = express.Router()
router.use(express.urlencoded({ extended: true }));

router.get('/upload', uploadFile);

module.exports = router
