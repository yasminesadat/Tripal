const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema(
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
    user: {
      type: mongoose.Schema.Types.ObjectId, //check this when we change the user schema
      ref: "Tourist",
      required: [true, "User is required"],
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
