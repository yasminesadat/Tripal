const Activity = require('../models/Activity');
const Advertiser = require('../models/Advertiser');

const createActivity = async (req, res) => {
  // try {
  //   const activity = new Activity({
  //     ...req.body,
  //     advertiser: req.advertiser._id  //assuming advertiser is authenticated
  //   });
  //   await activity.save();
  //   res.status(201).json(activity);
  // } catch (error) {
  //   res.status(400).json({ error: error.message });
  // }
  const { advertiser, title, description, date, time, location, priceRange, category, tags, specialDiscounts, isBookingOpen } = req.body;

  try {
    const existingAdvertiser = await Advertiser.findOne({ userName: advertiser });
    if (!existingAdvertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }

    const newActivity = new Activity({
      advertiser: existingAdvertiser.userName,  
      title,
      description,
      date,
      time,
      location,
      priceRange,
      category,
      tags,
      specialDiscounts,
      isBookingOpen
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Error saving activity:", error);
    res.status(500).json({ error: "Failed to save activity" });
  }
};

const getActivities = async (req, res) => {
  try {
    const { username } = req.params; 
    const activities = await Activity.find({ advertiser: username });
    if (activities.length === 0) {
      return res.status(404).json({ error: "No activities found for this advertiser" });
    }
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity)
         return res.status(404).json({ error: 'Activity not found' });
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

module.exports={
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity
}
