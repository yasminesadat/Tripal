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
  getTouristItineraries,
  toggleItineraryStatus,
  getAllItinerariesForAdmin,
  getItineraryById,
  revenue,
  getItineraryBookings,
  getTourguideBookings
} = require("../controllers/ItineraryController");

const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.get("/itinerary/:id", getItineraryById);
router.get(
  "/itinerary-bookings/:id",
  verifyToken,
  authorizeRoles("Tour Guide"),
  getItineraryBookings
);
router.get(
  "/my-itineraries-bookings",
  verifyToken,
  authorizeRoles("Tour Guide"),
  getTourguideBookings
);
router.post(
  "/create-itinerary",
  verifyToken,
  authorizeRoles("Tour Guide"),
  createItinerary
);

router.get("/my-itineraries",
  verifyToken,
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

router.get("/itinerary/upcoming/view",
  viewUpcomingItineraries);

router.get(
  "/itineraries/booked-itineraries",
  verifyToken,
  authorizeRoles("Tourist"),
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

router.get("/itinerary",verifyToken,authorizeRoles("Admin"),getAllItinerariesForAdmin,);

router.patch(
  "/itinerary/:id/status",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Tour Guide"),
  toggleItineraryStatus
);
router.get(
  "/itineraries/revenue",
  verifyToken,
  authorizeRoles("Tour Guide"),
  revenue
);

module.exports = router;