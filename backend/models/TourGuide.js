const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../models/User');
const tourGuideSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
      required: false,
      default: ""
    },

    experienceYears: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { timestamps: true }
);
const TourGuide = mongoose.model('tour guide', tourGuideSchema);
module.exports = TourGuide;