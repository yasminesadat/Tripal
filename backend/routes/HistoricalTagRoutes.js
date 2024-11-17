const express = require("express");
const router = express.Router();
const {
  createTypeTags,
  createPeriodTags,
  getHistTags,
  getAllHistoricalPeriod,
  getHistPeriodById,
  getHistTagById,
} = require("../controllers/HistoricalTagController");

const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.post(
  "/typetags",
  verifyToken,
  authorizeRoles("Tourism Governor"),
  createTypeTags
);

router.post(
  "/periodtags",
  verifyToken,
  authorizeRoles("Tourism Governor"),
  createPeriodTags
);

router.get("/typetags", getHistTags);
router.get("/periodtags", getAllHistoricalPeriod);
router.get("/typetags/:id", getHistTagById);
router.get("/periodtags/id", getHistPeriodById);

module.exports = router;
