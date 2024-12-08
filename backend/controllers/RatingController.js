const asyncHandler = require("express-async-handler");
const Tourist = require("../models/users/Tourist");

const addRating = (Model, RatingModel, entityIDField) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, review, userID } = req.body;

    const entity = await Model.findById(id);
    if (!entity) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }

    const tourist = await Tourist.findById(userID);
    if (!tourist) {
      res.status(404);
      throw new Error("User not found");
    }

    if (rating !== 0) {
      const existingRatings = await RatingModel.find({
        [entityIDField]: id,
        userID: userID,
      });
      const hasNonZeroRating = existingRatings.some(
        (rating) => rating.rating !== 0
      );
      if (hasNonZeroRating) {
        return res.status(400).json({
          message: "You can only rate once.",
        });
      }
    }

    if (rating !== 0) {
      const newRating = new RatingModel({
        rating,
        review,
        userID,
        [entityIDField]: id,
      });

      await newRating.save();

      const allRatings = await RatingModel.find({ [entityIDField]: id });
      const ratingsAboveZero = allRatings.filter((r) => r.rating > 0);
      entity.totalRatings = allRatings.length;
      const newAverage =
        ratingsAboveZero.reduce((acc, r) => acc + r.rating, 0) /
          ratingsAboveZero.length || 0;
      entity.averageRating = newAverage;
      await entity.save();

      return res.status(201).json({
        message: "Rating added successfully",
        rating: newRating,
        newAverage: newAverage,
      });
    }

    const newReview = new RatingModel({
      rating: 0,
      review,
      userID,
      [entityIDField]: id,
    });

    await newReview.save();
    return res.status(201).json({
      message: "Review added successfully without a rating.",
      review: newReview,
    });
  });

const getRatings = (Model, RatingModel, entityIDField) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const entity = await Model.findById(id);
    if (!entity) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }

    const ratings = await RatingModel.find({ [entityIDField]: id }).populate(
      "userID",
      "userName"
    );

    res.status(200).json({
      ratings,
      totalRatings: ratings.length,
    });
  });

module.exports = {
  addRating,
  getRatings,
};
