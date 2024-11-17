const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/UserController");

router.post("/login", loginUser);

module.exports = router;
