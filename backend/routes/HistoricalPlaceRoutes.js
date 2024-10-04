const express = require("express");
// const historicalPlaceController = require("../controllers/HistoricalPlaceController");
const { createHistoricalPlace,
  getHistoricalPlace,
  deleteHistoricalPlace,
  getAllHistoricalPlaces,
  updateHistoricalPlaces,
getTourismGovernerHistoricalPlaces } = require("../controllers/HistoricalPlaceController");
const historicalPlaceRouter = express.Router();

// historicalPlaceRouter.get(
//   path + "/create", historicalPlaceController.historical_place_create_get);
historicalPlaceRouter.get("/historicalPlaces", getAllHistoricalPlaces);
historicalPlaceRouter.post("/historicalPlaces", createHistoricalPlace);
historicalPlaceRouter.get("/historicalPlaces/:id", getHistoricalPlace);
historicalPlaceRouter.delete("/historicalPlaces/:id", deleteHistoricalPlace);
historicalPlaceRouter.put("/historicalPlaces/:id", updateHistoricalPlaces);
historicalPlaceRouter.get("/historicalPlaces/tourism-governer/:id", getTourismGovernerHistoricalPlaces);

module.exports = historicalPlaceRouter;
