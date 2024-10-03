const express = require("express");
const router = express.Router();
const { createRequest, getRequests, deleteRequest } = require("../controllers/RequestController");

router.post("/request", createRequest);
router.get("/request", getRequests);
router.delete("/request/:id", deleteRequest);


module.exports = router;