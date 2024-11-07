const express = require("express");
const router = express.Router();
const { requestAccountDeletion, getDeletionRequests, approveDeletionRequest } = require("../controllers/AccountDeletionRequestController");

router.post("/request-deletion/:role/:userId", requestAccountDeletion);
router.get("/deletion-requests", getDeletionRequests);
router.delete("/deletion-request/approve/:requestId", approveDeletionRequest);
  
module.exports = router;
