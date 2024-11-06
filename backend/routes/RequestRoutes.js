const express = require("express");
const router = express.Router();
const { createRequest, getRequests, deleteRequest, getRequestById, setRequestState, updateRequest } = require("../controllers/RequestController");

router.post("/request", createRequest);
router.get("/request", getRequests);
router.get("/request/:id", getRequestById);
router.delete("/request/:id", deleteRequest);
router.put("/request/:id", setRequestState);
router.put("/requestDocument/:id", updateRequest);
module.exports = router;