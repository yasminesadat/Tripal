const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { addRating, getRatings } = require("../controllers/RatingController");
const Itinerary = require("../models/Itinerary");
const ItineraryRating = require("../models/ItineraryRating");

const {
  createItinerary,
  getItinerariesForTourguide,
  updateItinerary,
  deleteItinerary,
  viewUpcomingItineraries,
  viewPaidItineraries,
  getTouristItineraries,
  toggleItineraryStatus,
} = require("../controllers/ItineraryController");

const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.post(
  "/create-itinerary",
  verifyToken,
  authorizeRoles("Tour Guide"),
  createItinerary
);

router.get("/my-itineraries",verifyToken,
  authorizeRoles("Tour Guide"),
  getItinerariesForTourguide);

router.put(
  "/itinerary/:id",
  verifyToken,
  authorizeRoles("Tour Guide"),
  updateItinerary
);

router.delete(
  "/itinerary/:id",
  verifyToken,
  authorizeRoles("Tour Guide"),
  deleteItinerary
);

router.get("/itinerary/upcoming/view", viewUpcomingItineraries);

router.get(
  "/itinerary/paid/view",
  verifyToken,
  authorizeRoles("Tourist"),
  viewPaidItineraries
);

router.get(
  "/itineraries/booked-itineraries/:touristId",
  verifyToken,
  authorizeRoles("Touriat"),
  getTouristItineraries
);

router.post(
  "/itinerary/:id/ratings",
  validateIDs(["id", "userID"]),
  verifyToken,
  authorizeRoles("Tourist"),
  addRating(Itinerary, ItineraryRating, "itineraryID")
);

router.get(
  "/itinerary/:id/ratings",
  validateIDs(["id"]),
  getRatings(Itinerary, ItineraryRating, "itineraryID")
);

router.put(
  "/itinerary/:id/toggleStatus",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Tour Guide"),
  toggleItineraryStatus
);

module.exports = router;