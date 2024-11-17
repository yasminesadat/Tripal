const express = require("express");
// const historicalPlaceController = require("../controllers/HistoricalPlaceController");
const {
  createHistoricalPlace,
  getHistoricalPlace,
  deleteHistoricalPlace,
  getAllHistoricalPlaces,
  updateHistoricalPlaces,
  getTourismGovernerHistoricalPlaces,
} = require("../controllers/HistoricalPlaceController");
const historicalPlaceRouter = express.Router();

const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

// historicalPlaceRouter.get(
//   path + "/create", historicalPlaceController.historical_place_create_get);
historicalPlaceRouter.get("/historicalPlaces/", getAllHistoricalPlaces);
historicalPlaceRouter.post(
  "/historicalPlaces/",
  verifyToken,
  authorizeRoles("Tourism Governor"),
  createHistoricalPlace
);
historicalPlaceRouter.get("/historicalPlaces/:id", getHistoricalPlace);
historicalPlaceRouter.delete("/historicalPlaces/:id", deleteHistoricalPlace);
historicalPlaceRouter.put(
  "/historicalPlaces/:id",
  verifyToken,
  authorizeRoles("Tourism Governor"),
  updateHistoricalPlaces
);
historicalPlaceRouter.get(
  "/historicalPlaces/tourismGoverner/:id",
  verifyToken,
  authorizeRoles("Tourism Governor"),
  getTourismGovernerHistoricalPlaces
);

module.exports = historicalPlaceRouter;
