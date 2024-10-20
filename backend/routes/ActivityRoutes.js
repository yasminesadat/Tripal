const express = require('express');
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { addRating, getRatings } = require("../controllers/RatingController");
const Activity = require("../models/Activity");
const ActivityRating = require("../models/ActivityRating");
const { createActivity, getAdvertiserActivities, updateActivity, deleteActivity, addRating, viewUpcomingActivities, addActivityComment, getActivityComments } = require('../controllers/ActivityController');


router.get('/activities/advertiser/:id', getAdvertiserActivities);
router.post('/activities', createActivity);
router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);
router.get('/activities/view', viewUpcomingActivities);
router.post("/activities/:id/ratings", validateIDs(["id", "userID"]), addRating(Activity, ActivityRating, 'activityID'));
router.get("/activities/:id/ratings", validateIDs(["id"]), getRatings(Activity, ActivityRating, 'activityID'));
router.post('/activity/comment', addActivityComment);
router.get('/activity/:activityId/comments', getActivityComments);


module.exports = router;