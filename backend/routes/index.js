const express = require('express');
const router = express.Router();

const routes = [
    './PreferenceTagRoutes',
    './SellerRoutes',
    './TourGuideRoutes',
    './AdvertiserRoutes',
    './activityControllerRoutes'
];

routes.forEach(route => {
    router.use('/api', require(route));
});

module.exports = router;
