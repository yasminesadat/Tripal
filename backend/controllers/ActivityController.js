const Activity = require('../models/Activity');

const createActivity = async (req, res) => {
  try {
    const activity = new Activity({
      ...req.body,
      advertiser: req.advertiser._id  //assuming advertiser is authenticated
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ advertiser: req.advertiser._id });
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
