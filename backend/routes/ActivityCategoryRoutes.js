const express = require("express");
const router = express.Router();
const {
  createActivityCategory,
  getActivityCategories, deleteActivityCategory, updateActivityCategory
} = require("../controllers/ActivityCategoryController.js");
const validateIDs = require('../middleware/IDMiddleware')


// create a new activity category
router.post("/activityCategory", createActivityCategory);
// get all activity categories
router.get("/activityCategories", getActivityCategories);
router.delete('/activityCategory/:id', validateIDs(['id']), deleteActivityCategory);
router.put('/activityCategory/:id', validateIDs(['id']), updateActivityCategory);
module.exports = router;
