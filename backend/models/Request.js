const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "userName name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type:String,
        enum: ['seller', 'tourGuide', 'advertiser'],
        required: true,
      },

    
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Request || mongoose.model("Request", requestSchema);
