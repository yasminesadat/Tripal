const activityCategory = require('../models/ActivityCategory')
const { default: mongoose } = require('mongoose');


const createActivityCategory = async (req, res) => {
    try {
        const activityCategoryCreated = await activityCategory.create({
            Name: req.body.Name
        })
        res.status(200).json(activityCategoryCreated)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

}
const getActivityCategories = async (req, res) => {
    try {
        const existingActivityCategories = await activityCategory.find({})
        res.status(200).json(existingActivityCategories)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

}
const deleteActivityCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await activityCategory.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Activity category not found" });
        }

        res.status(200).json({ message: "Activity category deleted successfully", data: { deletedCategory } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const updateActivityCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name } = req.body;

        const newActivityCategory = await activityCategory.findByIdAndUpdate(
            id,
            { Name },
            { new: true });

        if (!newActivityCategory) {
            return res.status(404).json('Activity category not found');
        }

        return res.status(200).json({ status: 'success', data: { newActivityCategory } })
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    createActivityCategory,
    getActivityCategories,
    deleteActivityCategory,
    updateActivityCategory

}