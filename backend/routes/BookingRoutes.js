const express = require("express");
const router = express.Router();
const {
  bookResource,
  cancelResource,
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

module.exports = router;
