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
    latitude: {
      type: Number,
      required: true, 
    },
    longitude: {
      type: Number,
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
    averageRating: {
      type: Number,
      default: 0.0,
    },
    specialDiscounts: {
      type: String,
    },
    isBookingOpen: {
      type: Boolean,
      default: false,
    },
    booked: {
      type: Boolean,
      default: false,
    },

    bookings: [
      {
          touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' },
          tickets: { type: Number, default: 1 },
      },
  ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);