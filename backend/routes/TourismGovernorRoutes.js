const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { addTourismGovernor, getTourismGovernors } = require('../controllers/TourismGovernorController');
const { changePassword } = require('../controllers/PasswordController.js');
const TourismGovernor = require("../models/users/TourismGovernor.js")


router.post("/governor", addTourismGovernor);
router.get("/governor", getTourismGovernors);
router.put("/governor-change-pass/:id", validateIDs(["id"]), changePassword(TourismGovernor));

module.exports = router;