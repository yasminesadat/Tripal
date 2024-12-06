const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { deleteUser, addAdmin, getAllUsers, createPromoCode,getDataForEventOwner } = require("../controllers/AdminController");
const { changePassword } = require("../controllers/PasswordController.js");
const Admin = require("../models/users/Admin.js");
const { adminFlagItinerary, getAllItinerariesForAdmin, } = require("../controllers/ItineraryController.js");
const { getAllActivitiesForAdmin, adminFlagActivity, } = require("../controllers/ActivityController.js");
const { verifyToken, authorizeRoles, } = require("../middleware/AuthMiddleware.js");
router.delete(
  "/admin/user/:role/:userId",
  verifyToken,
  authorizeRoles("Admin"),
  deleteUser
);


router.post("/admin/addAdmin", verifyToken, authorizeRoles("Admin"), addAdmin);


router.get("/admin/users", verifyToken, authorizeRoles("Admin"), getAllUsers);

router.patch(
  "/admin-change-pass/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Admin"),
  changePassword(Admin)
);

router.put(
  "/admin/flag-itinerary/:itineraryId",
  verifyToken,
  authorizeRoles("Admin"),
  adminFlagItinerary
);

router.patch(
  "/admin/flag-activity/:activityId",
  verifyToken,
  authorizeRoles("Admin"),
  adminFlagActivity
);

router.get(
  "/admin/itineraries",
  verifyToken,
  authorizeRoles("Admin"),
  getAllItinerariesForAdmin
);

router.get(
  "/admin/activities",
  verifyToken,
  authorizeRoles("Admin"),
  getAllActivitiesForAdmin
);

router.post(
  "/admin/promocode",
  verifyToken,
  authorizeRoles("Admin"),
  createPromoCode
);

router.get(
  "/admin/getDataForEventOwner/:userId",
  verifyToken,
  authorizeRoles("Admin"),
  getDataForEventOwner
);

module.exports = router;