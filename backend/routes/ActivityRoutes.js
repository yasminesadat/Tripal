const express = require('express');
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { addRating, getRatings } = require("../controllers/RatingController");
const Activity = require("../models/Activity");
const ActivityRating = require("../models/ActivityRating");
const { createActivity, getActivityById, getAdvertiserActivities, updateActivity, deleteActivity, viewUpcomingActivities, viewPaidActivities, addActivityComment, getActivityComments,bookActivity } = require('../controllers/ActivityController');


router.get('/activities/advertiser/:id', getAdvertiserActivities);
router.post('/activities', createActivity);
router.get('/activity/:activityId', getActivityById);
router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);
router.get('/activities/upcoming/view', viewUpcomingActivities);
router.get('/activities/paid/view', viewPaidActivities);
router.post("/activities/:id/ratings", validateIDs(["id", "userID"]), addRating(Activity, ActivityRating, 'activityID'));
router.get("/activities/:id/ratings", validateIDs(["id"]), getRatings(Activity, ActivityRating, 'activityID'));
router.post('/activity/comment/:activityId', addActivityComment);
router.get('/activity/comments/:activityId', getActivityComments);
router.post('/activity/:activityId/book', bookActivity);

module.exports = router;