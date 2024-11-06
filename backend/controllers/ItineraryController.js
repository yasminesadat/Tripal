const itineraryModel = require('../models/Itinerary');
const activityModel = require('../models/Activity');
const Rating = require('../models/Rating');
const preferenceTagModel = require('../models/PreferenceTag');
const touristModel = require('../models/users/Tourist');

const createItinerary = async (req, res) => {
    try {
        const { title, description, tourGuide, activities, serviceFee,
            language, availableDates, availableTime, accessibility, ratings,
            pickupLocation, dropoffLocation } = req.body;

        const fetchedActivities = await activityModel.find({ _id: { $in: activities } });

        if (!fetchedActivities || fetchedActivities.length === 0) {
            return res.status(404).json({ error: 'No activities found' });
        }

        let price = Number(serviceFee);
        const locations = []; //gama3ly locations
        const timeline = []; //name w time
        const tags = new Set(); //to remove dups

        fetchedActivities.forEach((activity) => {
            price += Number(activity.price);
            locations.push(activity.location);
            timeline.push({ activityName: activity.title, time: activity.time });
            activity.tags.forEach((tag) => tags.add(tag));
        })
        const uniqueTagIds = Array.from(tags);
        const fetchedTags = await preferenceTagModel.find({ _id: { $in: uniqueTagIds } });
        const uniqueTags = fetchedTags.map(tag => tag.name);


        const resultItinerary = await itineraryModel.create({
            title,
            description,
            tourGuide,
            activities,
            availableDates,
            availableTime,
            language,
            accessibility,
            serviceFee,
            pickupLocation,
            dropoffLocation,
            tourists: [],
            price,
            ratings,
            locations,
            timeline,
            tags: uniqueTags
        });
        res.status(201).json({
            itinerary: resultItinerary,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    };

};

const getItineraries = async (req, res) => {
    const { tourGuideId } = req.query;
    console.log("this is being used bro");
    try {
        const itineraries = await itineraryModel.find({ tourGuide: tourGuideId });

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tourGuide, activities, serviceFee,
            language, availableDates, availableTime, accessibility,
            pickupLocation, dropoffLocation } = req.body;

        const fetchedActivities = await activityModel.find({ _id: { $in: activities } });

        if (!fetchedActivities || fetchedActivities.length === 0) {
            return res.status(404).json({ error: 'No activities found' });
        }

        let price = Number(serviceFee);
        const locations = [];
        const timeline = [];
        const allTags = new Set();

        fetchedActivities.forEach((activity) => {
            price += Number(activity.price);
            locations.push(activity.location);
            timeline.push({ activityName: activity.title, time: activity.time });
            activity.tags.forEach((tag) => allTags.add(tag));
        })

        const uniqueTagIds = Array.from(allTags);
        const fetchedTags = await preferenceTagModel.find({ _id: { $in: uniqueTagIds } });
        const uniqueTags = fetchedTags.map(tag => tag.name);

        const updatedItinerary = await itineraryModel.findByIdAndUpdate(id, {
            title, description,
            tourGuide, activities, availableDates, availableTime, language,
            accessibility, pickupLocation, dropoffLocation, price, locations, serviceFee,
            timeline, tags: uniqueTags
        }, { new: true });
        if (!updatedItinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        res.status(200).json(updatedItinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteItinerary = async (req, res) => {
    try {
        const { id } = req.params;//check for this
        const itinerary = await itineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        await itineraryModel.findByIdAndDelete(id);
        res.status(200).json({ message: "deleted yay", itinerary });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//it should be updated to handle the date (upcoming)
const viewUpcomingItineraries = async (req, res) => {
    try {
        const itineraries = await itineraryModel.find().populate({
            path: 'activities',
            populate: {
                path: 'tags',
            },
        }).populate("tags")
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const viewPaidItineraries = async (req, res) => {
    try {
        const itineraries = await itineraryModel.find().populate({
            path: 'activities',
            populate: {
                path: 'tags',
            },
        }).populate("tags")

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addItineraryRating = async (req, res) => {

    try {
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }

        const tourist = await Tourist.findById(userID);
        if (!tourist) {
            return res.status(404).json({ error: "User not found" });
        }

        const newRating = new Rating({ rating, review, userID });
        await newRating.save();

        itinerary.ratings.push(newRating._id);
        await itinerary.save();

        res.status(201).json({
            message: "Rating added successfully",
            rating: newRating
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getItineraryRatings = async (req, res) => {
    const { id } = req.params;

    try {
        const itinerary = await Itinerary.findById(id).populate('ratings');
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }

        res.status(200).json(itinerary.ratings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTouristItineraries = async (req, res) => {
    try {
        const touristId = req.params.touristId;
        
        // Find itineraries that include the given touristId in the bookings array
        const itineraries = await itineraryModel.find({ 'bookings.touristId': touristId })
            .populate('tourGuide activities bookings.touristId');
        
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error });
    }
};


module.exports = {
    createItinerary,
    getItineraries,
    updateItinerary,
    deleteItinerary,
    viewUpcomingItineraries,
    viewPaidItineraries,
    addItineraryRating,
    getItineraryRatings,
    getTouristItineraries
};