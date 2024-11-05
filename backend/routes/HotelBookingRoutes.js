const express = require("express");
const router = express.Router();
const { searchHotels, getHotelDetails, getHotelPrices, getCityCode } = require('../controllers/HotelController');

router.get("/searchHotels",searchHotels);
router.get("/getHotelDetails",getHotelDetails);
router.get("/getHotelPrices", getHotelPrices);
router.get("/searchCity",getCityCode)


module.exports = router;