const express = require("express");
const router = express.Router();
const {
  getPrefTags,
  createPrefTags,
  updatePrefTags,
  deletePrefTags,
} = require("../controllers/PreferenceTagController");
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.get("/pref-tags", getPrefTags);
router.post("/pref-tags", verifyToken, authorizeRoles("Admin"), createPrefTags);
router.put("/pref-tags/:id", updatePrefTags);
router.delete("/pref-tags/:id", deletePrefTags);

module.exports = router;
