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
  "/complaint",
  verifyToken,
  authorizeRoles("Tourist"),
  createComplaint
); 

router.get(
  "/complaints/tourist",
  verifyToken,
  authorizeRoles("Tourist"),
  getComplaintsByTourist
); 

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
); 

router.put(
  "/complaint/status/:id",
  verifyToken,
  authorizeRoles("Admin"),
  updateComplaintStatus
); 

router.put(
  "/complaint/reply/:id",
  verifyToken,
  authorizeRoles("Admin", "Tourist"),
  replyToComplaint
); 

module.exports = router;
