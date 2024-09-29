const express = require('express');
const router = express.Router();

const routes = [
    './preference-tag-routes',
    './seller-routes',
    './tour-guide-routes',
    './advertiser-routes',
    './activity-category-routes',
    './tourist-routes',
    './product-routes',
    './ActivityRoutes',
];

routes.forEach(route => {
    router.use('/api', require(route));
});

module.exports = router;
