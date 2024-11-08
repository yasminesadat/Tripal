const express = require("express");
const router = express.Router();
const { getFlights }= require ('../controllers/FlightController');

router.get("/flightSearch", getFlights);


module.exports = router;