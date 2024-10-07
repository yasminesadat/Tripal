const express = require('express');
const router = express.Router();
const { createSeller, updateSellerData, readSellerData } = require('../controllers/SellerController');

// defining seller routes
router.post("/seller", createSeller);
router.put("/seller/:id", updateSellerData);
router.get("/seller/:id", readSellerData);

module.exports = router;
