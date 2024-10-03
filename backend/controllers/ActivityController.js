const Activity = require('../models/Activity');
const Advertiser = require('../models/Advertiser');
const ActivityCategory = require('../models/ActivityCategory');
const PreferenceTag = require('../models/PreferenceTag');


const createActivity = async (req, res) => {
  const {
    advertiser,
    title,
    description,
    date,
    time,
    location,
    priceRange,
    category: categoryName,
    tags: tagNames,
    specialDiscounts,
    isBookingOpen,
  } = req.body;
  try {
    const existingAdvertiser = await Advertiser.findOne({
      userName: advertiser,
    });
    if (!existingAdvertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    const category = await ActivityCategory.findOne({ Name: categoryName });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const tags = await PreferenceTag.find({ Name: { $in: tagNames } });
    if (!tags || tags.length === 0) {
      return res.status(404).json({ error: "Tags not found" });
    }

    const newActivity = new Activity({
      advertiser: existingAdvertiser.userName,
      title,
      description,
      date,
      time,
      location,
      priceRange,
      category: category._id, // Use the ObjectId of the category
      tags: tags.map((tag) => tag._id), // Use ObjectIds for tags
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
  const { username } = req.query;
  try {
    let activities;

    if (username) {
      activities = await Activity.find({ advertiser: username });
      if (activities.length === 0) {
        return res.status(404).json({ error: "No activities found for this advertiser" });
      }
    } else {
      activities = await Activity.find();
      if (activities.length === 0) {
        return res.status(404).json({ error: "No activities available" });
      }
    }

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateActivity = async (req, res) => {
  const {
    title,
    description,
    date,
    time,
    location,
    priceRange,
    category,
    tags,
    specialDiscounts,
    isBookingOpen,
  } = req.body;

  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    //validate and update category if provided
    if (category) {
      const existingCategory = await ActivityCategory.findOne({
        Name: category,
      });
      if (existingCategory) {
        activity.category = existingCategory._id; // Store the ObjectId of the category
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    // If tags are provided, validate and update
    if (tags && Array.isArray(tags)) {
      const tagNames = tags; // Assuming tags are sent as an array of names
      const existingTags = await PreferenceTag.find({
        Name: { $in: tagNames },
      });
      if (existingTags.length > 0) {
        activity.tags = existingTags.map((tag) => tag._id); // Store the ObjectIds of the tags
      } else {
        return res.status(404).json({ error: "Tags not found" });
      }
    }
    activity.title = title || activity.title;
    activity.description = description || activity.description;
    activity.date = date || activity.date;
    activity.time = time || activity.time;
    activity.location = location || activity.location;
    activity.priceRange = priceRange || activity.priceRange;
    activity.specialDiscounts = specialDiscounts || activity.specialDiscounts;
    activity.isBookingOpen =
      isBookingOpen !== undefined ? isBookingOpen : activity.isBookingOpen;
    await activity.save();
    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity)
      return res.status(404).json({ error: 'Activity not found' });
    res.status(200).json({ message: 'Activity deleted' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchActivities = async (req, res) => {
  const { term } = req.query; 

  try {
    let searches = {}; 

    // Search by name
    if (term) {
      searches.title = { $regex: term, $options: 'i' }; 
    }

    // Search by category
    const existingCategory = await ActivityCategory.findOne({ Name: { $regex: term, $options: 'i' } });
    if (existingCategory) {
      searches.category = existingCategory._id; 
    }

    // Search by tags
    const existingTags = await PreferenceTag.find({ Name: { $regex: term, $options: 'i' } });
    if (existingTags.length > 0) {
      searches.tags = { $in: existingTags.map(tag => tag._id) }; 
    }

    const activities = await Activity.find({
      $or: Object.keys(searches).map(key => ({ [key]: searches[key] }))
    }).populate('category').populate('tags');

    if (activities.length === 0) {
      return res.status(404).json({ error: 'No activities found' });
    }

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const viewUpcomingActivities = async(req, res) => {
  try {
    const currentDate = new Date();
    
    const activities = await Activity.find({ date: { $gte: currentDate } })
      .populate('category')
      .populate('tags');
    
    if (activities.length === 0) {
      return res.status(404).json({ error: "No upcoming activities available" });
    }

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const filterUpcomingActivities = async (req, res) => {
  const { budgetMin, budgetMax, startDate, endDate, category, rating } = req.query;

  try {
    const currentDate = new Date();
    
    let filters = { date: { $gte: currentDate } }; 

    // Filter based on budget 
    if (budgetMin || budgetMax) {
      filters.priceRange = {};
      if (budgetMin) filters.priceRange.$gte = budgetMin;
      if (budgetMax) filters.priceRange.$lte = budgetMax;
    }

    // Filter based on date
    if (startDate || endDate) {
      if (!filters.date) filters.date = {}; 
      if (startDate) filters.date.$gte = new Date(startDate);
      if (endDate) filters.date.$lte = new Date(endDate);
    }

    // Filter based on category
    if (category) {
      const existingCategory = await ActivityCategory.findOne({ Name: category });
      if (existingCategory) {
        filters.category = existingCategory._id;
      } else {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    // Filter based on rating
    if (rating) {
      filters.ratings = { $gte: rating };
    }

    const filteredActivities = await Activity.find(filters)
      .populate('category')
      .populate('tags');

    res.status(200).json(filteredActivities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sortUpcomingActivities = async (req, res) => {
  const { sortBy } = req.query;
  const currentDate = new Date(); 

  let sortCriteria = {};

  if (sortBy === 'price') {
    sortCriteria = { priceRange: 1 }; 
  } else if (sortBy === 'ratings') {
    sortCriteria = { ratings: -1 };  
  } else {
    sortCriteria = { date: 1 }; 
  }

  try {
    const activities = await Activity.find({ date: { $gte: currentDate } }) 
      .sort(sortCriteria); 

    if (activities.length === 0) {
      return res.status(404).json({ error: 'No upcoming activities found' });
    }

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports={
  createActivity,
  getAdvertiserActivities,
  updateActivity,
  deleteActivity,
  searchActivities,
  viewUpcomingActivities,
  filterUpcomingActivities,
  sortUpcomingActivities
}

console.log("Current Date:", new Date());
console.log("Activity Date:", new Date("2024-10-10T12:00:00.000Z"));
console.log(new Date("2024-10-10T12:00:00.000Z") > new Date())