const express = require('express');
const router = express.Router();
const { createSeller, updateSellerData } = require('../controllers/SellerController');

// defining seller routes
router.post("/seller", createSeller);
router.put("/seller/:id", updateSellerData);

module.exports = router;
