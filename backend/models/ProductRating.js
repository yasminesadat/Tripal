const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productRatingSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 0,
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
    productID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product",
      required: [true, "Product is required"],
    }
  },
  { timestamps: true }
);

const ProductRating = mongoose.model("ProductRating", productRatingSchema);
module.exports = ProductRating;
