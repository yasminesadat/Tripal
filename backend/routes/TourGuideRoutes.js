const express = require('express');
const router = express.Router();
const { createTourGuide, updateTourguideData, getTourguideInfo } = require('../controllers/TourGuideController');

// defining tour-guide routes
router.post("/tour-guide", createTourGuide);
router.put("/tour-guide/:id", updateTourguideData);
router.get("/tour-guide/:id", getTourguideInfo);

module.exports = router;
