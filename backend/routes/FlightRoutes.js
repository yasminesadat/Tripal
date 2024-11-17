const express = require("express");
const router = express.Router();
const { getFlights, getCityCode }= require ('../controllers/FlightController');

router.get("/flightSearch", getFlights);
router.get("/flightCity", getCityCode)


module.exports = router;