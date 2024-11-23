const itineraryModel = require('../models/Itinerary');
const activityModel = require('../models/Activity');
const Rating = require('../models/Rating');
const preferenceTagModel = require('../models/PreferenceTag');

const createItinerary = async (req, res) => {
    try {
        const tourGuideId = req.userId;
        const { title, description, activities, serviceFee,
            language, startDate,endDate, accessibility,
            pickupLocation, dropoffLocation } = req.body;
        const fetchedActivities = await activityModel.find({ _id: { $in: activities } });

        if (!fetchedActivities || fetchedActivities.length === 0) {
            return res.status(404).json({ error: 'No activities found' });
        }

        let price = Number(serviceFee);
        const location={
            latitude: fetchedActivities[0].latitude, 
            longitude: fetchedActivities[0].longitude};
        
        const timeline = [];
        const tags = new Set(); //to remove dups

        fetchedActivities.forEach((activity) => {
            price += Number(activity.price);
            timeline.push({ 
                activityName: activity.title,
                content:activity.description, 
                time: activity.time,
                date: activity.date});
            activity.tags.forEach((tag) => tags.add(tag));
        })
        const uniqueTagIds = Array.from(tags);
        const fetchedTags = await preferenceTagModel.find({ _id: { $in: uniqueTagIds } });
        const uniqueTags = fetchedTags.map(tag => tag.name);

        const resultItinerary = await itineraryModel.create({
            title,
            description,
            tourGuide: tourGuideId,
            activities,
            location,
            startDate,
            endDate,
            language,
            accessibility,
            serviceFee,
            pickupLocation,
            dropoffLocation,
            bookings: [],
            price,
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

const getItinerariesForTourguide = async (req, res) => {
    const tourGuideId = req.userId;
    try {
        const itineraries = await itineraryModel.find({ tourGuide: tourGuideId, flagged: false })
        .populate({
            path: 'activities',
            populate: [
                {
                    path: 'tags',
                },
                {
                    path: 'category',
                }
            ]
        }).populate("tags")

        res.status(200).json(itineraries);
    } catch (error) {
        console.error('Error fetching itineraries:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, activities, serviceFee,
            language, startDate,endDate, accessibility,
            pickupLocation, dropoffLocation } = req.body;
            
        const fetchedActivities = await activityModel.find({ _id: { $in: activities } });

        if (!fetchedActivities || fetchedActivities.length === 0) {
            return res.status(404).json({ error: 'No activities found' });
        }
     
        let price = Number(serviceFee);
        const location={
            latitude: fetchedActivities[0].latitude, 
            longitude: fetchedActivities[0].longitude};
        
        const timeline = [];
        const tags = new Set(); //to remove dups

        fetchedActivities.forEach((activity) => {
            price += Number(activity.price);
            timeline.push({ 
                activityName: activity.title,
                content:activity.description, 
                time: activity.time,
                date: activity.date});
            activity.tags.forEach((tag) => tags.add(tag));
        })

        const uniqueTagIds = Array.from(tags);
        const fetchedTags = await preferenceTagModel.find({ _id: { $in: uniqueTagIds } });
        const uniqueTags = fetchedTags.map(tag => tag.name);
        
        //leave it like this for now
        const itinerary = await itineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        if (itinerary.bookings.length > 0) {
            return res.status(400).json({ error: 'Cannot update itinerary with bookings' });
        }

        const updatedItinerary = await itineraryModel.findByIdAndUpdate(id, {
            title, description,
            tourGuide, activities, language,location, startDate,endDate,
            accessibility, pickupLocation, dropoffLocation, price, serviceFee,
            timeline, tags: uniqueTags
        }, { new: true });
        res.status(200).json(updatedItinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const itinerary = await itineraryModel.findById(id);
        console.log(itinerary);
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        await itineraryModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Itinerary Deleted Successfully", itinerary });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//it should be updated to handle the date (upcoming)
const viewUpcomingItineraries = async (req, res) => {
    try {
        const itineraries = await itineraryModel.find({flagged:false, isActive:true,availableDates: {
            $elemMatch: {
             $gte: new Date().setHours(0, 0, 0, 0) 
            }
        }}).populate({
            path: 'activities',
            populate: [
                {
                    path: 'tags',
                },
                {
                    path: 'category',
                }
            ]
        }).populate("tags");
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const viewPaidItineraries = async (req, res) => {
    try {
        const itineraries = await itineraryModel.find({flagged: false}).populate({
            path: 'activities',
            populate: [
                {
                    path: 'tags',
                },
                {
                    path: 'category',
                }
            ]
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
        const itineraries = await itineraryModel.find({ 'bookings.touristId': touristId,'bookings.selectedDate': { $gte: new Date() } , flagged: false }).populate({
            path: 'activities',
            populate: [
                {
                    path: 'tags',
                },
                {
                    path: 'category',
                }
            ]
        }).populate("tags")
            .populate('tourGuide bookings.touristId');
        
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error });
    }
};

const adminFlagItinerary = async (req, res) => {
    try{
        const itinerary= await itineraryModel.findById(req.params.itineraryId);
        if(!itinerary)
            return res.status(404).json({error: 'Itinerary not found'});
        if(itinerary.flagged)
            return res.status(400).json({error: 'Itinerary already flagged'});
        itinerary.flagged = true;
        await itinerary.save();
        res.status(200).json({message: 'Itinerary flagged successfully'});
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
};

const getAllItinerariesForAdmin = async (req, res) => {
    try {
        const itineraries = await itineraryModel.find()
            .populate({
                path: 'activities',
                populate: [
                    {
                        path: 'tags',
                    },
                    {
                        path: 'category',
                    }
                ]
            })
            .populate("tags");

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const toggleItineraryStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const itinerary = await itineraryModel.findById(id);
        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

        itinerary.isActive = !itinerary.isActive;
        await itinerary.save();

        res.status(200).json({ message: 'Itinerary status updated', itinerary });
    } catch (error) {
        res.status(500).json({ message: 'Error updating itinerary status', error });
    }
};


module.exports = {
    createItinerary,
    getItinerariesForTourguide,
    updateItinerary,
    deleteItinerary,
    viewUpcomingItineraries,
    viewPaidItineraries,
    addItineraryRating,
    getItineraryRatings,
    getTouristItineraries,
    adminFlagItinerary,
    getAllItinerariesForAdmin,
    toggleItineraryStatus
};