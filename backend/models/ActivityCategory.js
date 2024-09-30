const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activityCategorySchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ActivityCategory ||
  mongoose.model("ActivityCategory", activityCategorySchema);
