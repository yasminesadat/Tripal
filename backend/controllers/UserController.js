const User = require("../models/users/User"); // Adjust the path as necessary
const TourGuide = require("../models/users/TourGuide");
const Advertiser = require("../models/users/Advertiser");
const Seller = require("../models/users/Seller");
const Tourist = require("../models/users/Tourist");
const TourismGovernor = require("../models/users/TourismGovernor");
const Request = require("../models/Request");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(cookieParser());

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const request = await Request.findOne({ email });
      if (!request) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      if (!(await bcrypt.compare(password, request.password))) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      if (request.status === "pending")
        return res.status(403).json({
          message: "Request is pending",
        });
      return res.status(401).json({ message: "Request has been rejected" });
    }

    let userSchema;
    switch (user.role) {
      case "Tour Guide":
        userSchema = TourGuide;
        break;
      case "Advertiser":
        userSchema = Advertiser;
        break;
      case "Seller":
        userSchema = Seller;
        break;
      case "Tourist":
        userSchema = Tourist;
        break;
      case "Tourism Governor":
        userSchema = TourismGovernor;
        break;
    }

    // Find the user in the relevant schema
    const roleUser = await userSchema.findOne({ email });
    if (roleUser && (await bcrypt.compare(password, roleUser.password))) {
      const token = generateToken(roleUser._id, user.role);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3600 * 1000,
      });
      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginUser, generateToken };
