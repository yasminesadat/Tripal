const express = require('express');
const router = express.Router();
const { createTourist, updateTouristProfile, getTouristInfo } = require('../controllers/TouristController.js');

router.post("/createTourist", createTourist);
router.put('/updateTourist/:id', updateTouristProfile)
router.get('/getTouristInfo/:id', getTouristInfo)
module.exports = router;