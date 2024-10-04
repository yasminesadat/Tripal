const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    advertiser: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Advertiser",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number, required: true ,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ActivityCategory",
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "PreferenceTag",
        default: []
      },
    ],
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rating",
        default: []
      },
    ],
    specialDiscounts: {
      type: String,
    },
    isBookingOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
