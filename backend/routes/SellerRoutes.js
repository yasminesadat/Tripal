const express = require('express');
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { createSeller, updateSellerData, readSellerData } = require('../controllers/SellerController');
const { changePassword } = require('../controllers/PasswordController.js');
const Seller = require("../models/users/Seller.js")
// defining seller routes
router.post("/seller", createSeller);
router.put("/seller/:id", updateSellerData);
router.get("/seller/:id", readSellerData);
router.put("/seller-change-pass/:id", validateIDs(["id"]), changePassword(Seller));

module.exports = router;
