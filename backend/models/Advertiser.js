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
    website: {
      type: String,
      required: false
    },
    hotline: {
      type: String,
      required: false
    },
    companyProfile: {
      type: {
        companyName: {
          type: String,
          required: false
        },
        industry: {
          type: String,
          required: false
        },
        description: {
          type: String,
          required: false
        },
        foundedYear: {
          type: Number,
          required: false
        },
        employees: {
          type: Number,
          required: false
        },
        headquarters: {
          address: {
            type: String,
            required: false
          },
          city: {
            type: String,
            required: false
          },
          country: {
            type: String,
            required: false
          },
        },       
        socialMedia: {
          linkedin: {
            type: String,
            required: false
          },
          twitter: {
            type: String,
            required: false
          }
        },
        certifications: {
          type: [String], // Array of strings
          required: false
        },
        awards: [
          {
            title: {
              type: String,
              required: false
            },
            year: {
              type: Number,
              required: false
            },
            issuer: {
              type: String,
              required: false
            }
          }
        ]
      },
      required: false // The whole object is optional
    
    }

  },
  { timestamps: true }
);

const Advertiser = mongoose.model('advertiser', advertiserSchema);
module.exports = Advertiser;