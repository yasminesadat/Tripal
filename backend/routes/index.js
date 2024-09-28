const express = require('express');

// Create a new router
const router = express.Router();

// Use the imported routes
router.use('/tags', require('./PreferenceTagRoutes'));
router.use('/sellers', require('./SellerRoutes'));
router.use('/tourguides', require('./TourGuideRoutes'));
router.use('/advertisers', require('./AdvertiserRoutes'));

module.exports = router;
