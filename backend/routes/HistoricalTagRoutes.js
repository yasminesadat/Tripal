const express = require("express");
const router = express.Router();
const {
  createTypeTags,
  createPeriodTags,
  getHistTags,
  getAllHistoricalPeriod,
  getHistPeriodById,
  getHistTagById
} = require("../controllers/HistoricalTagController");

router.post("/typetags", createTypeTags);
router.post("/periodtags", createPeriodTags);
router.get("/typetags", getHistTags);
router.get("/periodtags",getAllHistoricalPeriod);
router.get("/typetags/:id", getHistTagById);
router.get("/periodtags/id",getHistPeriodById);


module.exports = router;
