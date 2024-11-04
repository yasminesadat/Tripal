const express = require("express");
const router = express.Router();
const validateIDs = require("../middleware/IDMiddleware");
const { createAdvertiser, readAdvertiser, updateAdvertiser } = require("../controllers/AdvertiserController");
const Advertiser = require("../models/users/Advertiser")
const { changePassword } = require('../controllers/PasswordController.js');
router.post("/advertiser", createAdvertiser);
router.get("/advertiser/:id", readAdvertiser);
router.put("/advertiser/:id", updateAdvertiser);
router.put("/advertiser-change-pass/:id", validateIDs(["id"]), changePassword(Advertiser));


module.exports = router;
