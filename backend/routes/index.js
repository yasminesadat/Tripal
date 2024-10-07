const express = require("express");
const router = express.Router();

const routes = [
  "./PreferenceTagRoutes",
  "./SellerRoutes",
  "./TourGuideRoutes",
  "./AdvertiserRoutes",
  "./ActivityCategoryRoutes",
  "./TouristRoutes",
  "./ProductRoutes",
  "./ActivityRoutes",
  "./TourismGovernorRoutes",
  "./HistoricalTagRoutes",
  "./HistoricalPlaceRoutes",
  "./RequestRoutes",
  "./AdminRoutes",
  "./ItineraryRoutes",
];

routes.forEach((route) => {
  router.use("/api", require(route));
});

module.exports = router;
