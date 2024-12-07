const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const {
  createAdvertiser,
  readAdvertiser,
  updateAdvertiser,
  markNotificationAdvertiser,
  deleteAdvertiserNotification,
  getAdvertiserNotifications,
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
  authorizeRoles("Admin", "Advertiser"),
  updateAdvertiser
);
router.put(
  "/advertiser-change-pass",
  verifyToken,
  authorizeRoles("Advertiser"),
  changePassword(Advertiser)
);


router.get(
  "/advertiser/notificationList",
  verifyToken,
  authorizeRoles("Advertiser"),
  getAdvertiserNotifications
);

router.delete(
  "/advertiser/deleteNotificationList/:id",
  verifyToken,
  authorizeRoles("Advertiser"),
  deleteAdvertiserNotification
);

router.patch(
  "/advertiser/markNotifications",
  verifyToken,
  authorizeRoles("Advertiser"),
  markNotificationAdvertiser
);

module.exports = router;
