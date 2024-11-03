const express = require('express');
const router = express.Router();
const { createTourist, updateTouristProfile, getTouristInfo,redeemPoints } = require('../controllers/TouristController.js');

router.post("/createTourist", createTourist);
router.put('/updateTourist/:id', updateTouristProfile)
router.get('/getTouristInfo/:id', getTouristInfo)
router.post('/redeem/:id', redeemPoints);

module.exports = router;