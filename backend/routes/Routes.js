const express = require('express');
const router = express.Router();
const { createTourGuide } = require('../controllers/TourGuideController.js');
const { createSeller } = require('../controllers/SellerController.js');
const { createAdvertiser } = require('../controllers/AdvertiserController.js');

// defining tourguide routes
router.post("/tourguide",createTourGuide);

// defining seller routes
router.post("/seller",createSeller);

//defining advertiser routes
router.post("/advertiser",createAdvertiser);

module.exports = router;
