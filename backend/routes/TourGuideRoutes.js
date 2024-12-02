const express = require("express");
const router = express.Router();
const {
  createTourGuide,
  updateTourguideData,
  getTourguideInfo,
  getTourguideNotifications
} = require("../controllers/TourGuideController");
const validateIDs = require("../middleware/IDMiddleware");
const TourGuide = require("../models/users/TourGuide");
const { addRating, getRatings } = require("../controllers/RatingController");
const TourGuideRating = require("../models/TourGuideRating");
const { changePassword } = require("../controllers/PasswordController");
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");
// defining tour-guide routes

router.post("/tourGuide", createTourGuide);
router.patch("/tourGuide/:id", updateTourguideData);


router.get(
  "/tourGuide/notificationList",
  verifyToken,
  authorizeRoles("Tour Guide"),
  getTourguideNotifications
);


router.get(
  "/tourGuide",
  verifyToken,
  authorizeRoles("Tour Guide", "Admin"),
  getTourguideInfo
);
router.post(
  "/tourGuide/:id/ratings",
  validateIDs(["id", "userID"]),
  verifyToken,
  authorizeRoles("Tourist"),
  addRating(TourGuide, TourGuideRating, "tourGuideID")
);
router.get(
  "/tourGuide/:id/ratings",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Tourist", "Tour Guide"),
  getRatings(TourGuide, TourGuideRating, "tourGuideID")
);

router.put(
  "/tourGuide-change-pass/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Tour Guide"),
  changePassword(TourGuide)
);

module.exports = router;
