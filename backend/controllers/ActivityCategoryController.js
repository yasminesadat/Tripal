const activityCategory = require('../models/ActivityCategory')
const { default: mongoose } = require('mongoose');
const asyncHandler = require("express-async-handler");

const createActivityCategory = asyncHandler(async (req, res) => {
    const { Name } = req.body;
    if (!Name) {
        res.status(400);
        throw new Error("Cant have an Category Name");
    }
    if (activityCategory.find({ Name: Name })) {
        res.status(400);
        throw new Error("Duplicate activity category");
    }
    const activityCategoryCreated = await activityCategory.create({ Name });
    if (activityCategoryCreated) {
        res.status(201).json(activityCategoryCreated);
    } else {
        res.status(400);
        throw new Error("Invalid Activity Category Name");
    }
});

const getActivityCategories = asyncHandler(async (req, res) => {
    const existingActivityCategories = await activityCategory.find({});
    res.status(200).json(existingActivityCategories);
});
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