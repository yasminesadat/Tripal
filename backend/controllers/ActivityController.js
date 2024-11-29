const Activity = require("../models/Activity");
const Advertiser = require("../models/users/Advertiser");
const ActivityCategory = require("../models/ActivityCategory");
const PreferenceTag = require("../models/PreferenceTag");

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
    const activites = await Activity.find({ advertiser: id })
      .select("title date time location")
    console.log(activites)
    res.status(200).json(activites);
  } catch (error) {
    res.status(400).json({ error: error.message })
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

    // if (activity.flagged)
    //   res.status(404).json({ error: "Activity flagged." });
    else
      res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

const getTouristActivities = async (req, res) => {
  const { touristId } = req.userId;
  try {
    const activities = await Activity.find({ "bookings.touristId": touristId, isBookingOpen: true, flagged: false, date: { $gte: new Date() } })
      .populate("category")
      .populate("tags")
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
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const adminFlagActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    activity.flagged = !activity.flagged;
    await activity.save();
    res.status(200).json({ message: "Activity flagged successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
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