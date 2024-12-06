const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    required: true,
    enum: ["Tour Guide", "Advertiser", "Seller", "Tourist", "Tourism Governor", "Admin"],
  },
  otp: {
    type: String,
    select: false,
  },
  otpExpiresAt: {
    type: Date,
    select: false,
  },
});

userSchema.methods.generateOtp = async function () {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); //10 minutes
  this.otp = otp;
  this.otpExpiresAt = expirationTime;
  await this.save();
  return otp;
};

userSchema.methods.clearExpiredOtp = function () {
  if (this.otpExpiresAt && new Date() > this.otpExpiresAt) {
    this.otp = undefined;
    this.otpExpiresAt = undefined;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;