const express = require("express");
const router = express.Router();
const { requestOtp, validateOtp } = require("../controllers/OtpController");

router.post("/request-otp", requestOtp);
router.post("/validate-otp", validateOtp);

module.exports = router;