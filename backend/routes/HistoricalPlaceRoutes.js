const express = require("express");
// const historicalPlaceController = require("../controllers/HistoricalPlaceController");
const { createHistoricalPlace,
  getHistoricalPlace,
  deleteHistoricalPlace,
  getAllHistoricalPlaces,
  updateHistoricalPlaces } = require("../controllers/HistoricalPlaceController");
const historicalPlaceRouter = express.Router();
let path = "/historicalPlaces";
// historicalPlaceRouter.get(
//   path + "/create", historicalPlaceController.historical_place_create_get);
historicalPlaceRouter.get(path + "/", getAllHistoricalPlaces);
historicalPlaceRouter.post(path + "/", createHistoricalPlace);
historicalPlaceRouter.get(path + "/:id", getHistoricalPlace);
historicalPlaceRouter.delete(path + "/:id", deleteHistoricalPlace);
historicalPlaceRouter.put(path + "/:id", updateHistoricalPlaces
);
module.exports = historicalPlaceRouter;
