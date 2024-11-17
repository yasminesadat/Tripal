const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const {
  createSeller,
  updateSellerData,
  readSellerData,
} = require("../controllers/SellerController");
const { changePassword } = require("../controllers/PasswordController.js");
const Seller = require("../models/users/Seller.js");
const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/AuthMiddleware.js");

router.post("/seller", createSeller);
router.put(
  "/seller/:id",
  verifyToken,
  authorizeRoles("Seller"),
  updateSellerData
);
router.get(
  "/seller/:id",
  verifyToken,
  authorizeRoles("Seller", "Admin"),
  readSellerData
);
router.put(
  "/seller-change-pass/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Seller"),
  changePassword(Seller)
);

module.exports = router;
