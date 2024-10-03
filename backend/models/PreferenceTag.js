const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const preferenceTagSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PreferenceTag", preferenceTagSchema);
