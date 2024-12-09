const express = require("express");
const router = express.Router();
const { deleteUser, addAdmin, getAllUsers, createPromoCode, getPromoCodes, getDataForEventOwner, getTotalUsersCount, getUsersPerMonth, getAdminNotifications } = require("../controllers/AdminController");
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
  "/admin-change-pass",
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
  "/admin/promocode",
  verifyToken,
  authorizeRoles("Admin"),
  getPromoCodes
);



router.get(
  "/admin/getDataForEventOwner/:userId",
  verifyToken,
  authorizeRoles("Admin"),
  getDataForEventOwner
);

router.get(
  "/admin/getTotalUsers",
  verifyToken,
  authorizeRoles("Admin"),
  getTotalUsersCount
);

router.get(
  "/admin/getUsersPerMonth/:searchYear",
  verifyToken,
  authorizeRoles("Admin"),
  getUsersPerMonth
);

router.get(
  "/admin/notifications",
  verifyToken,
  authorizeRoles("Admin"),
  getAdminNotifications
);
module.exports = router;