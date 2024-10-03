const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
