const express = require("express");
const router = express.Router();
const { createComplaint } = require('../controllers/ComplaintsController')

router.post("/complaint/:id", createComplaint);


module.exports = router;
