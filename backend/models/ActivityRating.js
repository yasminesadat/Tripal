const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activityRatingSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating value is required"],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Tourist",
      required: [true, "User is required"],
    },
    activityID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Activity",
      required: [true, "Activity is required"],
    }
  },
  { timestamps: true }
);

const ActivityRating = mongoose.model("ActivityRating", activityRatingSchema);
module.exports = ActivityRating;
