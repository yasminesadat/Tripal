const express = require('express');
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { createItinerary, getItineraries, updateItinerary, deleteItinerary, viewItineraries} = require('../controllers/ItineraryController');
const { addRating, getRatings } = require("../controllers/RatingController"); 
const Itinerary = require("../models/Itinerary"); 
const ItineraryRating = require("../models/ItineraryRating");

router.post('/itinerary', createItinerary); 
router.get('/itinerary', getItineraries);
router.put('/itinerary/:id', updateItinerary);
router.delete('/itinerary/:id', deleteItinerary);
router.get('/itinerary/view', viewItineraries);
router.post("/itinerary/:id/ratings", validateIDs(["id", "userID"]), addRating(Itinerary, ItineraryRating, 'itineraryID'));
router.get("/itinerary/:id/ratings", validateIDs(["id"]), getRatings(Itinerary, ItineraryRating, 'itineraryID'));
module.exports = router;