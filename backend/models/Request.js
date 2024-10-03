const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const requestSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
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
      type: String,
      enum: ["seller", "tourGuide", "advertiser"],
      required: true,
    },
      type:String,
        enum: ['seller', 'tourGuide', 'advertiser'],
        required: true,
      },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Request || mongoose.model("Request", requestSchema);
