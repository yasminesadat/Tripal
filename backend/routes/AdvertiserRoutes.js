const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const {
  createAdvertiser,
  readAdvertiser,
  updateAdvertiser,
} = require("../controllers/AdvertiserController");
const Advertiser = require("../models/users/Advertiser");
const { changePassword } = require("../controllers/PasswordController.js");
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.post("/advertiser", createAdvertiser);
router.get(
  "/advertiser",
  verifyToken,
  authorizeRoles("Admin", "Advertiser"),
  readAdvertiser
);
router.put(
  "/advertiser",
  verifyToken,
  authorizeRoles("Admin"),
  updateAdvertiser
);
router.put(
  "/advertiser-change-pass/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Admin"),
  changePassword(Advertiser)
);

module.exports = router;
