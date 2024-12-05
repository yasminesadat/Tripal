const itineraryModel = require('../models/Itinerary');
const activityModel = require('../models/Activity');
const preferenceTagModel = require('../models/PreferenceTag');
const {sendEmail} = require('./Mailer');
const Admin = require("../models/users/Admin.js");


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
        .sort({ startDate: -1 });

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
            activities, language,location, startDate,endDate,tourGuide: req.userId,
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
        const currentDate = new Date();
        const itineraries = await itineraryModel.find({startDate: { $gt: currentDate },
            isActive: true,
            flagged: false}).populate({
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
        .sort({ startDate: -1 });
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

const getTouristItineraries = async (req, res) => {
    try {
        const touristId = req.userId;
        // const currentDate = new Date();

        const itineraries = await itineraryModel.find(
            { 'bookings.touristId': touristId,
            // endDate: { $gte: currentDate },
            flagged: false }).populate({

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
        .populate('tourGuide bookings.touristId')
        .select("-bookings") //exclude bookings from response
        .sort({ startDate: -1 });

        if (!itineraries.length)
            return res.status(200).json({ message: "No booked itineraries found for this tourist." });
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error });
    }
};

const adminFlagItinerary = async (req, res) => {
    try{
        const adminId = req.userId;
        const admin = await Admin.findById(adminId);
        if (!admin) 
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        const itinerary= await itineraryModel.findById(req.params.itineraryId).populate('tourGuide');
         
        if(!itinerary)
            return res.status(404).json({error: 'Itinerary not found'});

        const userData  = req.body;
        sendAnEmailForItineraryFlag(userData,itinerary.title);
       
        itinerary.flagged = !itinerary.flagged;
        await itinerary.save();

        //SEND NOTIFICATION TO TOUR GUIDE ON SYSTEM 
    
        if (itinerary.flagged){
        itinerary.tourGuide.notificationList.push({message:`Your itinerary ${itinerary.title} has been flagged as inappropriate by the admin.`})
        }
        else{
            itinerary.tourGuide.notificationList.push({message:`Your itinerary ${itinerary.title} has been flagged as appropriate by the admin.`})
        } 
        

        //console.log(itinerary.tourGuide);
        await itinerary.tourGuide.save();
        res.status(200).json({message: 'Itinerary flagged successfully'});
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
};

const getAllItinerariesForAdmin = async (req, res) => {
    try {
        const itineraries = await itineraryModel.find()
        .sort({ startDate: -1 });
            // .populate({
            //     path: 'activities',
            //     populate: [{path: 'tags'},{path: 'category', }]
            // })
            // .populate("tags");
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

const getItineraryById = async (req, res) => {
    try {
        const itinerary = await itineraryModel.findById(req.params.id)
            .populate({
            path: 'activities',
            populate: [{path: 'tags'},{path: 'category', }]
            })
            .populate("tags");
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }
        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const sendAnEmailForItineraryFlag = async (userData,itineraryTitle) => {
    const mail = userData.email;
    const userName = userData.userName;
    const subject = `Itinerary Flag Notification`;
    const html = `
      <p>Dear ${userName},</p>
      <p>We wanted to inform you that your itinerary: <strong>${itineraryTitle}</strong> has been flagged for review. Please review the flagged content and address any issues as soon as possible.</p>
      <p>If you have any questions or believe this flagging was a mistake, please <a href="mailto:support@tripal.com">contact support</a>.</p>
      <p>Thank you for your understanding.</p>
      <p>Best regards,</p>
      <p>Your Support Team</p>
    `;
    try {
      await sendEmail(mail, subject, html);
      console.log('Flag notification email sent successfully');
    } catch (error) {
      console.error('Failed to send flag notification email:', error);
    }
};  

module.exports = {
    createItinerary,
    getItinerariesForTourguide,
    updateItinerary,
    deleteItinerary,
    viewUpcomingItineraries,
    viewPaidItineraries,
    getTouristItineraries,
    adminFlagItinerary,
    getAllItinerariesForAdmin,
    toggleItineraryStatus,
    getItineraryById
};