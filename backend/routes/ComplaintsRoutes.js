const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getComplaintsByTourist,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  replyToComplaint,
} = require("../controllers/ComplaintsController");
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.post(
  "/complaint/:id",
  verifyToken,
  authorizeRoles("Tourist"),
  createComplaint
); //tourist id

router.get(
  "/complaints/tourist/:id",
  verifyToken,
  authorizeRoles("Tourist"),
  getComplaintsByTourist
); //tourist id

router.get(
  "/complaints",
  verifyToken,
  authorizeRoles("Admin"),
  getAllComplaints
);

router.get(
  "/complaints/:id",
  verifyToken,
  authorizeRoles("Admin", "Tourist"),
  getComplaintById
); //complaint id

router.put(
  "/complaint/status/:id",
  verifyToken,
  authorizeRoles("Admin"),
  updateComplaintStatus
); //complaint id

router.put(
  "/complaint/reply/:id",
  verifyToken,
  authorizeRoles("Admin", "Tourist"),
  replyToComplaint
); //complaint id

module.exports = router;
