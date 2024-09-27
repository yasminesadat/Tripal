const express = require('express');
const router = express.Router();
const { createTourGuide } = require('../controllers/tourGuideController.js');
const { createSeller } = require('../controllers/sellerController.js');
const { createAdvertiser } = require('../controllers/advertiserController.js');

// defining tour-guide routes
router.post("/tour-guide",createTourGuide);

// defining seller routes
router.post("/seller",createSeller);

//defining advertiser routes
router.post("/advertiser",createAdvertiser);

module.exports = router;
