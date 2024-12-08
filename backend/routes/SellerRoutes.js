const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const {
  createSeller,
  updateSellerData,
  readSellerData,
  markNotificationSeller,
  getSellerNotifications,
} = require("../controllers/SellerController");
const { changePassword } = require("../controllers/PasswordController.js");
const Seller = require("../models/users/Seller.js");
const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/AuthMiddleware.js");

router.post("/seller",
  verifyToken,
  authorizeRoles("Admin"),
  createSeller);


router.put(
  "/seller",
  verifyToken,
  authorizeRoles("Seller"),
  updateSellerData
);
router.get(
  "/seller",
  verifyToken,
  authorizeRoles("Seller", "Admin"),
  readSellerData
);
router.put(
  "/seller-change-pass",
  verifyToken,
  authorizeRoles("Seller"),
  changePassword(Seller)
);

router.patch(
  "/seller/markNotifications",
  verifyToken,
  authorizeRoles("Seller"),
  markNotificationSeller
);

router.get(
  "/seller/notificationList",
  verifyToken,
  authorizeRoles("Seller"),
  getSellerNotifications
);

module.exports = router;
