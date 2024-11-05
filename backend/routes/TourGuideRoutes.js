const express = require("express");
const router = express.Router();
const {
  createTourGuide,
  updateTourguideData,
  getTourguideInfo,
} = require("../controllers/TourGuideController");
const validateIDs = require("../middleware/IDMiddleware");
const TourGuide = require("../models/users/TourGuide");
const { addRating, getRatings } = require("../controllers/RatingController");
const TourGuideRating = require("../models/TourGuideRating");
const { changePassword } = require("../controllers/PasswordController");
// defining tour-guide routes
router.post("/tourGuide", createTourGuide);
router.patch("/tourGuide/:id", updateTourguideData);
router.get("/tourGuide/:id", getTourguideInfo);
router.post(
  "/tourGuide/:id/ratings",
  validateIDs(["id", "userID"]),
  addRating(TourGuide, TourGuideRating, "tourGuideID")
);
router.get(
  "/tourGuide/:id/ratings",
  validateIDs(["id"]),
  getRatings(TourGuide, TourGuideRating, "tourGuideID")
);
router.put(
  "/tourGuide-change-pass/:id",
  validateIDs(["id"]),
  changePassword(TourGuide)
);

module.exports = router;
