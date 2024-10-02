const itineraryController = require('..models/Itinerary.js');

const createItinerary = async(req,res) => {
const {title, description, tourGuide, activities,
     languages,availableDates,availableTime,accessibility,
     pickupLocation,dropoffLocation} = req.body;
     
};
const getItineraries = async(req,res) => {};
const updateItinerary = async(req,res) => {};


const deleteItinerary = async(req,res) => {
     try {
          const { id } = req.params;//check for this
          const itinerary = await Itinerary.findById(id);
          if (!itinerary) {
              return res.status(404).json({ error: 'Itinerary not found' });
          }
        await itinerary.remove();
          res.status(200).json({ message: 'Itinerary deleted' });
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
};

module.exports = {createItinerary, getItineraries, updateItinerary, deleteItinerary};