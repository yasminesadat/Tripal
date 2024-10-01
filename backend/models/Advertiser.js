const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require ('../models/User');
const advertiserSchema = new Schema(
  {
    companyLink: {
      type: string,
      required: true
    },

    hotline: {
      type: Int16Array,
      required: true
    },

    companyProfile: {
      type: string,
      required: true
    }

  },
  { timestamps: true }
);

const Advertiser = User.discriminator('advertiser', advertiserSchema);
module.exports = Advertiser;
