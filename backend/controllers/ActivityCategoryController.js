const activityCategory = require('../models/ActivityCategory')
const { default: mongoose } = require('mongoose');
const asyncHandler = require("express-async-handler");

const createActivityCategory = asyncHandler(async (req, res) => {
    const { Name } = req.body;

    if (!Name) {
        res.status(400);
        throw new Error("Category Name is required");
    }

    const existingCategory = await activityCategory.findOne({ Name });
    if (existingCategory) {
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

const deleteActivityCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedCategory = await activityCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
        return res.status(404).json({ message: "Activity category not found" });
    }

    res.status(200).json({ message: "Activity category deleted successfully", data: { deletedCategory } });
});

const updateActivityCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { Name } = req.body;

    const existingCategory = await activityCategory.findOne({ Name });
    if (existingCategory && existingCategory._id.toString() !== id) {
        return res.status(400).json({ error: 'An activity category with this name already exists' });
    }

    const newActivityCategory = await activityCategory.findByIdAndUpdate(id, { Name }, { new: true });

    if (!newActivityCategory) {
        return res.status(404).json({ error: 'Activity category not found' });
    }

    return res.status(200).json({ status: 'success', data: { newActivityCategory } });
});

module.exports = {
    createActivityCategory,
    getActivityCategories,
    deleteActivityCategory,
    updateActivityCategory
};
