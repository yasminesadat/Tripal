const express = require('express');
const router = express.Router();
const controllers = require('../controllers');


// defining tour-guide routes
router.post("/tour-guide",controllers.createTourGuide);

// defining seller routes
router.post("/seller",controllers.createSeller);

//defining advertiser routes
router.post("/advertiser",controllers.createAdvertiser);

module.exports = router;
