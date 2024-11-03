const express = require("express");
const router = express.Router();
const { searchHotels } = require('../controllers/HotelController');

router.get("/searchHotels",searchHotels);

module.exports = router;