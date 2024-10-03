const express = require("express");
const router = express.Router();
const { createAdvertiser, readAdvertiser, updateAdvertiser } = require("../controllers/AdvertiserController");

router.post("/advertiser", createAdvertiser);
router.get("/advertiser/:id", readAdvertiser);
router.put("/advertiser/:id", updateAdvertiser);


module.exports = router;
