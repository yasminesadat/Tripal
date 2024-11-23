const express = require("express");
const router = express.Router();
const Tourist = require("../models/users/Tourist.js");
const validateIDs = require("../middleware/IDMiddleware");
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");
const {
  createTourist,
  updateTouristProfile,
  getTouristInfo,
  redeemPoints,
  getTouristNameAndEmail,
  getTouristBookedFlights,
  getTouristAge,
  getTouristBookedHotels,
  getTouristPreferences,
  getTouristCategories,
  checkUserExists,
} = require("../controllers/TouristController.js");
const { changePassword } = require("../controllers/PasswordController.js");

router.post("/createTourist", createTourist);
router.put(
  "/updateTourist",
  verifyToken,
  authorizeRoles("Tourist"),
  updateTouristProfile
);
router.get(
  "/getTouristInfo",
  verifyToken,
  authorizeRoles("Tourist", "Admin"),
  getTouristInfo
);
router.post(
  "/redeem",
  verifyToken,
  authorizeRoles("Tourist"),
  redeemPoints
);
router.put(
  "/tourist-change-pass",
  verifyToken,
  authorizeRoles("Tourist"),
  changePassword(Tourist)
);
router.get(
  "/tourist-name-email",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristNameAndEmail
);
router.get(
  "/tourist/flights",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristBookedFlights
);
router.get(
  "/tourist/age",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristAge
);
router.get(
  "/tourist/bookedHotels",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristBookedHotels
);
router.get(
  "/tourist/preferences",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristPreferences
);
router.get(
  "/tourist/categories",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristCategories
);

router.get(
  "/tourist/exists",
  verifyToken,
  checkUserExists
);

module.exports = router;
