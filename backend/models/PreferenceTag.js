const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const preferenceTagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
  },
  { timestamps: true }
);
const PreferenceTag = mongoose.model("PreferenceTag", preferenceTagSchema);
module.exports = PreferenceTag
