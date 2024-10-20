const Activity = require("../models/Activity");
const Advertiser = require("../models/users/Advertiser");
const ActivityCategory = require("../models/ActivityCategory");
const PreferenceTag = require("../models/PreferenceTag");
const Rating = require("../models/Rating");
const Tourist = require("../models/users/Tourist.js");


const createActivity = async (req, res) => {
  const {
    advertiser,
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
    const existingAdvertiser = await Advertiser.findById(advertiser);
    if (!existingAdvertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    const category = await ActivityCategory.findById({ _id: categoryId });
    console.log(category)
    // if (!category) {
    //   return res.status(404).json({ error: "Category not found" });
    // }
    // console.log("Tag names being searched:", tagNames);

    // const existingTags = await PreferenceTag.find({ _id: { $in: tagIds } });
    // console.log(existingTags)
    // if (!existingTags || existingTags.length === 0) {
    //   return res.status(404).json({ error: "Tags not found" });

    // }
    // console.log(existingTags)
    // const ratings = await Rating.find({ _id: { $in: ratingIds } });
    // if (!ratings || ratings.length === 0) {
    //   return res.status(404).json({ error: "Ratings not found" });
    // }

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
  const { id } = req.params;
  try {
    const activites = await Activity.find({ advertiser: id })
      .populate("advertiser")
      .populate("category")
      .populate("tags")
      .populate("ratings");
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

    const activities = await Activity.find({ date: { $gte: currentDate } })
      .populate("category")
      .populate("tags")
      .populate("ratings");

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addActivityComment = async (req, res) => {
  const { userId, activityId, text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: "Please enter a comment." });
  }
  
  try {
    const comment = new ActivityComment({ userId, activityId, text });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while saving the comment.", error: error.message });
  }
}

const getActivityComments = async (req, res) => {
  const { activityId } = req.params;

  try {
    const comments = await ActivityComment.find({ activityId })
      .populate('userId', 'name'); 
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving comments.", error: error.message });
  }
};

module.exports = {
  createActivity,
  getAdvertiserActivities,
  updateActivity,
  deleteActivity,
  addRating,
  addActivityComment,
  viewUpcomingActivities,
  addActivityComment,
  getActivityComments
};
