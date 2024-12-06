const express = require("express");
const router = express.Router();
const {
  bookResource,
  cancelResource,
  completeBooking
} = require("../controllers/BookingController");
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.post(
  "/:resourceType/:resourceId/book",
  verifyToken,
  authorizeRoles("Tourist"),
  bookResource
);
router.post(
  "/:resourceType/:resourceId/cancel",
  verifyToken,
  authorizeRoles("Tourist"),
  cancelResource
);

router.post(
  "/:resourceType/:resourceId/complete-booking",
  verifyToken,
  authorizeRoles("Tourist"),
  completeBooking
);

module.exports = router;
