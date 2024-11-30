const express = require("express");
const router = express.Router();
const {
  loginUser,
  getUserData,
  logoutUser,
} = require("../controllers/UserController");
const { verifyToken } = require("../middleware/AuthMiddleware");

router.post("/login", loginUser);
router.get("/user-data", getUserData);
router.post("/logout", logoutUser);

module.exports = router;
