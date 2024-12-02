const User = require("../models/users/User.js");
const{sendEmail} =require("./Mailer");

async function requestOtp(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
  
    const otp = await user.generateOtp();
  
    try {
      await sendOtpEmail(email, otp);
    } catch (error) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
    return res.status(200).json({ otp: user.otp });
}
  
async function validateOtp(req, res) {
try {
    const { email, otp } = req.body; 
    const user = await User.findOne({ email }).select("+otp +otpExpiresAt");
    if (!user) return res.status(400).json({ message: "User not found" });
    console.log(user.otpExpiresAt);
    console.log(user.otp);
    console.log(otp); 
    user.clearExpiredOtp();
    await user.save();

    if (!user.otp || user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "OTP validated successfully" });
} catch (error) {
    console.error("Error in validateOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
}
}

const sendOtpEmail = async (email, otp) => {
    const subject = "Your OTP Code";
    const html = `
      <p>Hello,</p>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
      <p>Thank you!</p>
    `;
  
    try {
      await sendEmail(email, subject, html);
      console.log("OTP email sent successfully to:", email);
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
};
  
module.exports = {
  requestOtp,
  validateOtp,
};