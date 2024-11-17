const express = require("express");
const router = express.Router();
const {
  searchHotels,
  getHotelDetails,
  getHotelPrices,
  getCityCode,
  saveBooking,
} = require("../controllers/HotelController");

const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.get("/searchHotels", searchHotels);
router.get("/getHotelDetails", getHotelDetails);
router.get("/getHotelPrices", getHotelPrices);
router.get("/searchCity", getCityCode);
router.post(
  "/saveBooking",
  verifyToken,
  authorizeRoles("Tourist"),
  saveBooking
);

module.exports = router;
