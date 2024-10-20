const express = require('express');
const router = express.Router();

const { createItinerary, getItineraries, updateItinerary, deleteItinerary, viewItineraries, addItineraryRating, getItineraryRatings, addItineraryComment, getItineraryComments } = require('../controllers/ItineraryController');

router.post('/itinerary', createItinerary); 
router.get('/itinerary', getItineraries);
router.put('/itinerary/:id', updateItinerary);
router.delete('/itinerary/:id', deleteItinerary);
router.get('/itinerary/view', viewItineraries);
router.post('/itineraryRating/:id', addItineraryRating);
router.get('/itineraryRatings/:id', getItineraryRatings);
router.post('/itinerary/comment', addItineraryComment);
router.get('/itinerary/:itineraryId/comments', getItineraryComments)

module.exports = router;