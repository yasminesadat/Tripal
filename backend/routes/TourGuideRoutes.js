const express = require('express');
const router = express.Router();
const { createTourGuide, updateTourguideData, getTourguideInfo } = require('../controllers/TourGuideController');
const { addRating } = require("../controllers/RatingController");
const TourGuide = require("../models/users/TourGuide"); 

// defining tour-guide routes
router.post("/tourGuide", createTourGuide);
router.put("/tourGuide/:id", updateTourguideData);
router.get("/tourGuide/:id", getTourguideInfo);

module.exports = router;
