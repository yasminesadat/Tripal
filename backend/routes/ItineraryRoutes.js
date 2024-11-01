const express = require('express');
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { addRating, getRatings } = require("../controllers/RatingController");
const Itinerary = require("../models/Itinerary");
const ItineraryRating = require("../models/ItineraryRating");
const { createItinerary, getItineraries, updateItinerary, deleteItinerary, viewItineraries, getItineraryRatings, addItineraryComment, getItineraryComments,bookItinerary } = require('../controllers/ItineraryController');

router.post('/itinerary', createItinerary);
router.get('/itinerary', getItineraries);
router.put('/itinerary/:id', updateItinerary);
router.delete('/itinerary/:id', deleteItinerary);
router.get('/itinerary/view', viewItineraries);

router.post("/itinerary/:id/ratings", validateIDs(["id", "userID"]), addRating(Itinerary, ItineraryRating, 'itineraryID'));
router.get("/itinerary/:id/ratings", validateIDs(["id"]), getRatings(Itinerary, ItineraryRating, 'itineraryID'));
// router.post('/itineraryRating/:id', addItineraryRating);
router.get('/itineraryRatings/:id', getItineraryRatings);
router.post('/itinerary/comment', addItineraryComment);
router.get('/itinerary/:itineraryId/comments', getItineraryComments)
router.post('/itineraries/:itineraryId/book', bookItinerary);


module.exports = router;