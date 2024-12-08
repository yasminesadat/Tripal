const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { addRating, getRatings } = require("../controllers/RatingController");
const Activity = require("../models/Activity");
const ActivityRating = require("../models/ActivityRating");

const {
  createActivity,
  getAdvertiserActivities,
  updateActivity,
  deleteActivity,
  viewUpcomingActivities,
  getTouristActivities,
  viewHistoryActivities,
  getActivityById,
  getAllActivities,
  getActivityBookings,
  revenue,
  getAdvertiserBookings,
} = require("../controllers/ActivityController");

const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.get(
  "/booked-activities",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristActivities
);
router.get(
  "/activities/advertiser",
  verifyToken,
  authorizeRoles("Advertiser"),
  getAdvertiserActivities
);
router.get(
  "/activity-bookings:id",
  verifyToken,
  authorizeRoles("Advertiser"),
  getActivityBookings
);
router.get(
  "/my-activities-bookings",
  verifyToken,
  authorizeRoles("Advertiser"),
  getAdvertiserBookings
);
router.get("/activity/:id", getActivityById);
router.post(
  "/activities",
  verifyToken,
  authorizeRoles("Advertiser"),
  createActivity
);
router.put(
  "/activities/:id",
  verifyToken,
  authorizeRoles("Advertiser"),
  updateActivity
);
router.delete(
  "/activities/:id",
  verifyToken,
  authorizeRoles("Advertiser"),
  deleteActivity
);
router.get("/activities/upcoming", viewUpcomingActivities);
router.get("/activities/history", viewHistoryActivities);
router.post(
  "/activities/:id/ratings",
  validateIDs(["id", "userID"]),
  verifyToken,
  authorizeRoles("Tourist"),
  addRating(Activity, ActivityRating, "activityID")
);
router.get(
  "/activities/:id/ratings",
  validateIDs(["id"]),
  getRatings(Activity, ActivityRating, "activityID")
);

router.get(
  "/activities/revenue",
  verifyToken,
  authorizeRoles("Advertiser"),
  revenue
);

router.get("/all-activities",verifyToken,authorizeRoles("Admin"), getAllActivities);

module.exports = router;
