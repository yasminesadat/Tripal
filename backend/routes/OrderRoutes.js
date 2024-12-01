const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/OrderController"); 
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");
const validateIDs = require("../middleware/IDMiddleware");


router.post(
  "/tourist/order",
  validateIDs(["id", "userID"]),
  verifyToken,
  authorizeRoles("Tourist"),
  createOrder
);

module.exports = router;
