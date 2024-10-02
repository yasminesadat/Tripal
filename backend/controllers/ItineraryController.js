const itineraryModel = require('..models/Itinerary.js');
const activityModel = require('..models/Activity.js');


const createItinerary = async(req,res) => {
    try {
    const {title, description, tourGuide, activities,
    language,availableDates,availableTime,accessibility,
    pickupLocation,dropoffLocation} = req.body;

    const fetchedActivities = await activityModel.find({ _id: { $in: activities } });

    if (!fetchedActivities || fetchedActivities.length === 0) {
        return res.status(404).json({ error: 'No activities found' });
    }

    let price = 0;
    const locations = []; //gama3ly locations
    const timeline = []; //name w time
    const tags = new Set(); //to remove dups

    fetchedActivities.forEach((activity) => {
        price+=activity.price;
        locations.push(activity.location);
        timeline.push({activityName: activity.title, time: activity.time});
        activity.tags.forEach((tag) => tags.add(tag));
    })
    const uniqueTags = Array.from(allTags);


    const resultItinerary = await itineraryModel.create({
        title,
        description,
        tourGuide,
        activities,
        availableDates,
        availableTime,
        language,
        accessibility,
        pickupLocation,
        dropoffLocation,
        tourists: []
    });
    res.status(201).json({
        itinerary: resultItinerary,
        price,
        locations,
        timeline,
        tags: uniqueTags
    });
    } 
    catch (error) {
    res.status(400).json({ error: error.message });
    };

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