const express = require('express');
const router = express.Router();
const Tourist = require("../models/users/Tourist.js");
const validateIDs = require("../middleware/IDMiddleware");
const { createTourist, updateTouristProfile, getTouristInfo, redeemPoints, getTouristNameAndEmail, getTouristBookedFlights, getTouristAge,getTouristBookedHotels } = require('../controllers/TouristController.js');
const { changePassword } = require('../controllers/PasswordController.js');

router.post("/createTourist", createTourist);
router.put('/updateTourist/:id', updateTouristProfile)
router.get('/getTouristInfo/:id', getTouristInfo)
router.post('/redeem/:id', redeemPoints);
router.put("/tourist-change-pass/:id", validateIDs(["id"]), changePassword(Tourist));
router.get("/tourist-name-email/:id", validateIDs(["id"]), getTouristNameAndEmail);
router.get ("/tourist/flights/:id", getTouristBookedFlights);
router.get ("/tourist/age/:id", getTouristAge);
router.get ("/tourist/bookedHotels/:id", getTouristBookedHotels);


module.exports = router;