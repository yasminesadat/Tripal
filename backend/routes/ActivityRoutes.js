const express = require('express');
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { addRating, getRatings } = require("../controllers/RatingController");
const Activity = require("../models/Activity");
const ActivityRating = require("../models/ActivityRating");

const { createActivity, getAdvertiserActivities, 
    updateActivity, deleteActivity, viewUpcomingActivities, 
    getTouristActivities,
    viewHistoryActivities, getActivityById } = require('../controllers/ActivityController');

router.get('/activities/advertiser/:id', getAdvertiserActivities);
router.get('/activity/:id', getActivityById);
router.post('/activities', createActivity);
router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);
router.get('/activities/upcoming', viewUpcomingActivities);
router.get('/activities/history', viewHistoryActivities);
router.post("/activities/:id/ratings", validateIDs(["id", "userID"]), addRating(Activity, ActivityRating, 'activityID'));
router.get("/activities/:id/ratings", validateIDs(["id"]), getRatings(Activity, ActivityRating, 'activityID'));
router.get('/activities/:touristId', getTouristActivities);

module.exports = router;