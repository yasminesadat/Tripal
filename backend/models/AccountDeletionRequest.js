const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountDeletionRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Advertiser", "Tourist", "Tourguide", "Seller"], 
    },
    requestDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved"],
      default: "Pending",
    },
    reviewedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccountDeletionRequest", accountDeletionRequestSchema);
