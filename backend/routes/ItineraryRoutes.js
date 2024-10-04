const express = require('express');
const router = express.Router();

const { createItinerary, getItineraries, updateItinerary, deleteItinerary, viewItineraries } = require('../controllers/ItineraryController');

router.post('/itinerary', createItinerary); 
router.get('/itinerary', getItineraries);
router.put('/itinerary/:id', updateItinerary);
router.delete('/itinerary/:id', deleteItinerary);
router.get('/itinerary/view', viewItineraries);


module.exports = router;