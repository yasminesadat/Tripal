const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
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
      enum: ["Seller", "Tour Guide", "Advertiser"],
      required: true,
    },
    status: {
      type: String,
      default: "pending"
    },
    document: {
      type: String,
      required: false,
      default: "",
    },
    // documents: [String], used for the future 
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Request || mongoose.model("Request", requestSchema);
