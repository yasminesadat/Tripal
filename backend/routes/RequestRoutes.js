const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
  deleteRequest,
  getRequestById,
  setRequestState,
  updateRequest,
  requestAccountDeletion,
} = require("../controllers/RequestController");
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");
router.post("/request", createRequest);
router.get("/request", verifyToken, authorizeRoles("Admin"), getRequests);
router.get(
  "/request/:id",
  verifyToken,
  authorizeRoles("Admin"),
  getRequestById
);
router.delete(
  "/request/:id",
  verifyToken,
  authorizeRoles("Admin"),
  deleteRequest
);
router.put(
  "/request/:id",
  verifyToken,
  authorizeRoles("Admin"),
  setRequestState
);
router.put("/requestDocument/:id", updateRequest);
router.delete(
  "/request-deletion",
  verifyToken,
  authorizeRoles("Advertiser", "Tour Guide", "Seller", "Tourist"),
  requestAccountDeletion
);

module.exports = router;
