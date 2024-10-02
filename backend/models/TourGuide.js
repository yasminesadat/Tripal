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
    },

    experienceYears: {
      type: Number,
      required: false
    }
  },
  { timestamps: true }
);
const TourGuide = mongoose.model('tour guide', tourGuideSchema);
module.exports = TourGuide;