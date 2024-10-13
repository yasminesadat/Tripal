const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tourGuideRatingSchema = new Schema(
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
    tourGuideID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "tour guide",
      required: [true, "Tour Guide is required"],
    }
  },
  { timestamps: true }
);

const TourGuideRating = mongoose.model("TourGuideRating", tourGuideRatingSchema);
module.exports = TourGuideRating;
