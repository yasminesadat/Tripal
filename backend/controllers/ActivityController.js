const Activity = require("../models/Activity");
const Advertiser = require("../models/users/Advertiser");
const ActivityCategory = require("../models/ActivityCategory");
const PreferenceTag = require("../models/PreferenceTag");
const {sendEmail} = require('./Mailer');
const Tourist = require('../models/users/Tourist');


const createActivity = async (req, res) => {
  const {
    title,
    description,
    date,
    time,
    location,
    latitude,
    longitude,
    price,
    category: categoryId,
    tags: tagIds,
    specialDiscounts,
    isBookingOpen,
  } = req.body;

  try {
    const existingAdvertiser = await Advertiser.findById(req.userId);
    console.log(existingAdvertiser)
    if (!existingAdvertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    const category = await ActivityCategory.findById({ _id: categoryId });

    const newActivity = new Activity({
      advertiser: existingAdvertiser._id,
      title,
      description,
      date,
      time,
      location,
      latitude,
      longitude,
      price,
      category: category._id,
      tags: tagIds,
      specialDiscounts,
      isBookingOpen,
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Error saving activity:", error);
    res.status(500).json({ error: "Failed to save activity" });
  }
};

const getAdvertiserActivities = async (req, res) => {
  const id = req.userId;
  console.log("curr advertiser is", id);
  try {
    const activities = await Activity.find({ advertiser: id })
      .select("title date time location")
      .sort({ date: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const notifyTouristsOnBookingOpen = async (activityId) => {
  try {
    // Find the activity by ID
    const activity = await Activity.findById(activityId).populate('bookings.touristId');
    if (!activity) {
      console.log('Activity not found');
      return;
    }
    console.log("will try to send emails now")
    // Loop through the bookings and send an email to each tourist
    for (let id of activity.bookmarked) {
      const tourist = await Tourist.findById(id);
      console.log(tourist)
      console.log(tourist.email)
      if (tourist && tourist.email) {
        const subject = `Your upcoming activity is now open for booking: ${activity.title}`;
        const html = `
          <p>Dear ${tourist.userName},</p>
          <p>The activity "${activity.title}" you bookmarked is now open for booking!</p>
          <p>Location: ${activity.location}</p>
          <p>We hope you're excited! If you have any questions, feel free to contact us.</p>
          <p>Best regards,</p>
          <p>Tripal Team</p>
        `;
        await sendEmail(tourist.email, subject, html); // Send email via utility function
        console.log(`Email sent to ${tourist.email}`);
      }
    }
  } catch (error) {
    console.error("Error sending email notifications:", error);
  }
};

const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { tags, category, ...updateParameters } = req.body;

  try {
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    if (category) {
      const existingCategory = await ActivityCategory.findOne({ Name: category });
      if (existingCategory) {
        updateParameters.category = existingCategory._id;
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    if (tags && Array.isArray(tags)) {
      const existingTags = await PreferenceTag.find({ _id: { $in: tags } });
      if (existingTags.length > 0) {
        const currentTagIds = new Set(activity.tags.map(tag => tag.toString()));
        existingTags.forEach(tag => currentTagIds.add(tag._id.toString()));
        updateParameters.tags = Array.from(currentTagIds);
      } else {
        return res.status(404).json({ error: "Tags not found" });
      }
    }

    const updatedActivity = await Activity.findByIdAndUpdate(id, updateParameters, { new: true });
    if (updatedActivity.isBookingOpen && updatedActivity.isBookingOpen !== activity.isBookingOpen) { //only sends when update is actually made le isBookingOpen
      await notifyTouristsOnBookingOpen(updatedActivity._id);
    }
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.status(200).json({ message: "Activity deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const viewUpcomingActivities = async (req, res) => {
  try {
    const currentDate = new Date();
    const activities = await Activity.find({ date: { $gte: currentDate }, flagged: false })
      .populate("category")
      .populate("tags")
      .sort({ date: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//fix this date when there are entries
const viewHistoryActivities = async (req, res) => {
  try {
    const currentDate = new Date();

    const activities = await Activity.find({ date: { $gte: currentDate }, flagged: false })
      .populate("category")
      .populate("tags")

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActivityById = async (req, res) => {
  const { id } = req.params;

  try {
    const activity = await Activity.findById(id).populate("category").populate("tags");
    if (!activity)
      return res.status(404).json({ error: "Activity not found." });
    else
      res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

const getTouristActivities = async (req, res) => {
  const  touristId  = req.userId;
  try {
    const activities = await Activity.find({ "bookings.touristId": touristId,  flagged: false, date: { $gte: new Date() } })
    
      .sort({ date: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllActivitiesForAdmin = async (req, res) => {
  try {
    console.log("here for admin");
    const activities = await Activity.find()
      .populate("category")
      .populate("tags")
      .sort({ date: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("category")
      .populate("tags")
      .sort({ date: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const adminFlagActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId).populate('advertiser');
    const userData  = req.body;
   
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    activity.flagged = !activity.flagged;
    
   

    sendAnEmailForActivityFlag(userData, activity.title);
    console.log("hii55",activity.advertiser.notificationList);
    if (activity.flagged){
      activity.advertiser.notificationList.push({message:`Your activity ${activity.title} has been flagged as inappropriate by the admin.`})
      }
      else{
          activity.advertiser.notificationList.push({message:`Your activity ${activity.title} has been flagged as appropriate by the admin.`})
      } 

      await activity.save();
      await activity.advertiser.save();

    res.status(200).json({ message: "Activity flagged successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sendAnEmailForActivityFlag = async (userData, activityTitle) => {
  const mail = userData.email;
  const userName = userData.userName;

  const subject = `Activity Flag Notification`;
  const html = `
    <p>Dear ${userName},</p>
    <p>We wanted to inform you that your activity: <strong>${activityTitle}</strong> has been flagged for review. Please review the flagged content and address any issues as soon as possible.</p>
    <p>If you have any questions or believe this flagging was a mistake, please <a href="mailto:support@tripal.com">contact support</a>.</p>
    <p>Thank you for your understanding.</p>
    <p>Best regards,</p>
    <p>Your Support Team</p>
  `;

  try {
    await sendEmail(mail, subject, html);
    console.log('Activity flag notification email sent successfully');
  } catch (error) {
    console.error('Failed to send activity flag notification email:', error);
  }
};

module.exports = {
  createActivity,
  getActivityById,
  getAdvertiserActivities,
  updateActivity,
  deleteActivity,
  viewUpcomingActivities,
  viewHistoryActivities,
  getTouristActivities,
  getAllActivitiesForAdmin,
  getAllActivities,
  adminFlagActivity
};