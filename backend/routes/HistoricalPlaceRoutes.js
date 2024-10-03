const express = require("express");
const historicalPlaceController = require("../controllers/HistoricalPlaceController");
const historicalPlaceRouter = express.Router();
let path = "/historicalPlaces";
historicalPlaceRouter.get(
  path + "/create",
  historicalPlaceController.historical_place_create_get
);
historicalPlaceRouter.get(
  path + "/",
  historicalPlaceController.historical_place_index
);
historicalPlaceRouter.post(
  path + "/",
  historicalPlaceController.historical_place_create_post
);
historicalPlaceRouter.get(
  path + "/:id",
  historicalPlaceController.historical_place_details
);
historicalPlaceRouter.delete(
  path + "/:id",
  historicalPlaceController.historical_place_delete
);
historicalPlaceRouter.put(
  path + "/:id",
  historicalPlaceController.historical_place_update
);
module.exports = historicalPlaceRouter;
