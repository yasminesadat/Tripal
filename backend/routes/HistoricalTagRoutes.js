const express = require("express");
const router = express.Router();
const {createTypeTags, createPeriodTags, getHistTags } = require('../controllers/HistoricalTagControllers');


router.post("/typetags",createTypeTags);
router.post("/periodtags",createPeriodTags);
router.get("/historicaltags",getHistTags);


module.exports = router;