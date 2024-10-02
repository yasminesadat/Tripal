const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../models/User');
const advertiserSchema = new Schema(
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
    hotline: {
      type: String,
      required: false
    },
    // fix
    companyProfile: {
      type: String,
      required: false
    }

  },
  { timestamps: true }
);

const Advertiser = mongoose.model('advertiser', advertiserSchema);
module.exports = Advertiser;
