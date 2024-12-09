const express = require("express");
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

historicalPlaceRouter.get(
  "/historicalPlaces/tourismGoverner",
  verifyToken,
  authorizeRoles("Tourism Governor"),
  getTourismGovernerHistoricalPlaces
);

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


module.exports = historicalPlaceRouter;
