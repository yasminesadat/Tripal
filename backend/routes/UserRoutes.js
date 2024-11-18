const express = require("express");
const router = express.Router();
const { loginUser, getUserData } = require("../controllers/UserController");
const { verifyToken } = require("../middleware/AuthMiddleware");

router.post("/login", loginUser);
router.get("/user-data", getUserData);

module.exports = router;
