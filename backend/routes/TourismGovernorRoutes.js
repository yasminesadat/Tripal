const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const {
  addTourismGovernor,
  getTourismGovernors,
} = require("../controllers/TourismGovernorController");
const { changePassword } = require("../controllers/PasswordController.js");
const TourismGovernor = require("../models/users/TourismGovernor.js");
const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/AuthMiddleware.js");

router.post(
  "/governor",
  verifyToken,
  authorizeRoles("Admin"),
  addTourismGovernor
);
router.get(
  "/governor",
  verifyToken,
  authorizeRoles("Admin"),
  getTourismGovernors
);
router.put(
  "/governor-change-pass/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Tourism Governor"),
  changePassword(TourismGovernor)
);

module.exports = router;
