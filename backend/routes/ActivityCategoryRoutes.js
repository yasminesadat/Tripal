const express = require("express");
const router = express.Router();
const {
  createActivityCategory,
  getActivityCategories,
  deleteActivityCategory,
  updateActivityCategory,
} = require("../controllers/ActivityCategoryController.js");
const validateIDs = require("../middleware/IDMiddleware");
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.post(
  "/activityCategory",
  verifyToken,
  authorizeRoles("Admin"),
  createActivityCategory
);

router.get("/activityCategories", getActivityCategories);

router.delete(
  "/activityCategory/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Admin"),
  deleteActivityCategory
);

router.put(
  "/activityCategory/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Admin"),
  updateActivityCategory
);
module.exports = router;
