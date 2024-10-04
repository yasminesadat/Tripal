const express = require('express');
const router = express.Router();

const { createItinerary, getItineraries, updateItinerary, deleteItinerary,getTourGuideItineraries } = require('../controllers/ItineraryController');

router.post('/itinerary', createItinerary); 
router.get('/itinerary', getItineraries);
router.put('/itinerary/:id', updateItinerary);
router.delete('/itinerary/:id', deleteItinerary);
router.get('/itinerary/tour-guide/:id',getTourGuideItineraries);

module.exports = router;