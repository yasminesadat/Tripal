const express = require('express');

// Create a new router
const router = express.Router();

// Use the imported routes
router.use('/prefTags', require('./PreferenceTagRoutes'));
router.use('/sellers', require('./SellerRoutes'));
router.use('/tourguides', require('./TourGuideRoutes'));
router.use('/advertisers', require('./AdvertiserRoutes'));
router.use('/tourist', require('./touristRoutes'));
router.use('/activityCategory', require('./activityControllerRoutes'));
module.exports = router;
