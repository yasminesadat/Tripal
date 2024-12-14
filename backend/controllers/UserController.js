const User = require("../models/users/User");
const TourGuide = require("../models/users/TourGuide");
const Advertiser = require("../models/users/Advertiser");
const Admin = require("../models/users/Admin");
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
    expiresIn: "2h",
  });
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ userName });

    if (!user) {
      const request = await Request.findOne({ userName });

      if (!request) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }
      if (!(await bcrypt.compare(password, request.password))) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
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
      case "Admin":
        userSchema = Admin;
        break;
    }

    const roleUser = await userSchema.findOne({ userName });
    if (roleUser && (await bcrypt.compare(password, roleUser.password))) {
      let isFirstTime = false;

      if (user.role === "Tourist") {
        isFirstTime = roleUser.isFirstTime;
        if (isFirstTime) {
          roleUser.isFirstTime = false;
          await roleUser.save();
        }
      }

      const token = generateToken(roleUser._id, user.role);

      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',  // Required for cross-site requests
        path: '/',
        domain: isProduction ? 'tripal-production.up.railway.app' : 'localhost',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      res.status(200).json({ role: user.role, isFirstTime });
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserData = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(200)
      .json({ status: "error", message: "No token found." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      status: "success",
      id: decoded.id,
      role: decoded.role,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(200).json({
        status: "error",
        message: "Token expired.",
      });
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "Invalid token." });
    }
  }
};

const logoutUser = (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: 'None',  // Capitalized to match login
      path: '/',
      domain: isProduction ? 'tripal-production.up.railway.app' : 'localhost'
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { loginUser, logoutUser, getUserData };
