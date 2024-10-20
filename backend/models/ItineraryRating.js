const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itineraryRatingSchema = new Schema(
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
    itineraryID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Itinerary",
      required: [true, "Itinerary is required"],
    }
  },
  { timestamps: true }
);

const ItineraryRating = mongoose.model("ItineraryRating", itineraryRatingSchema);
module.exports = ItineraryRating;
