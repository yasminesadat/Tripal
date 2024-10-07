const express = require("express");
const router = express.Router();
const { addTourismGovernor, getTourismGovernors } = require('../controllers/TourismGovernorController');


router.post("/governor", addTourismGovernor);
router.get("/governor",getTourismGovernors);

module.exports = router;