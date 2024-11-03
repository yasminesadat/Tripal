const asyncHandler = require("express-async-handler");
const Tourist = require('../models/users/Tourist');

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

    const newRating = new RatingModel({
      rating,
      review,
      userID,
      [entityIDField]: id,
    });

    await newRating.save();

    // Calculate new average rating
    const allRatings = await RatingModel.find({ [entityIDField]: id });
    const newAverage =
      allRatings.reduce((acc, r) => acc + r.rating, 0) / allRatings.length || 0;

    entity.averageRating = newAverage;

    await entity.save();

    res.status(201).json({
      message: "Rating added successfully",
      rating: newRating,
      newAverage: newAverage,
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

    const ratings = await RatingModel.find({ [entityIDField]: id }).populate('userID', 'userName');

    res.status(200).json({
      ratings,
      totalRatings: ratings.length,
    });
  });

module.exports = {
  addRating,
  getRatings
};