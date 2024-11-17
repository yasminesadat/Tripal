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
  "/updateTourist/:id",
  verifyToken,
  authorizeRoles("Tourist"),
  updateTouristProfile
);
router.get(
  "/getTouristInfo/:id",
  verifyToken,
  authorizeRoles("Tourist", "Admin"),
  getTouristInfo
);
router.post(
  "/redeem/:id",
  verifyToken,
  authorizeRoles("Tourist"),
  redeemPoints
);
router.put(
  "/tourist-change-pass/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Tourist"),
  changePassword(Tourist)
);
router.get(
  "/tourist-name-email/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristNameAndEmail
);
router.get(
  "/tourist/flights/:id",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristBookedFlights
);
router.get(
  "/tourist/age/:id",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristAge
);
router.get(
  "/tourist/bookedHotels/:id",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristBookedHotels
);
router.get(
  "/tourist/preferences/:id",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristPreferences
);
router.get(
  "/tourist/categories/:id",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristCategories
);
router.get("/tourist/exists/:id", checkUserExists);

module.exports = router;
