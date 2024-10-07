const express = require('express');
const router = express.Router();
const { createTourGuide, updateTourguideData, getTourguideInfo } = require('../controllers/TourGuideController');

// defining tour-guide routes
router.post("/tourGuide", createTourGuide);
router.put("/tourGuide/:id", updateTourguideData);
router.get("/tourGuide/:id", getTourguideInfo);

module.exports = router;
