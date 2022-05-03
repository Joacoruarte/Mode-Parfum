const express = require("express");
const router = express.Router();

const { newPassword } = require("../controllers/newPassword.controllers")

router.post("/", newPassword);

module.exports = router;