const express = require("express");
const router = express.Router();
const { requestOtp, validateOtp,resetPassword } = require("../controllers/OtpController");

router.post("/request-otp", requestOtp);
router.post("/validate-otp", validateOtp);
router.post("/reset-password", resetPassword);

module.exports = router;