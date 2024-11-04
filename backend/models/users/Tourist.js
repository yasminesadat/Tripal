const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const touristSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  wallet: {
    amount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    currency: {
      type: String,
      required: true,
      default: "EGP",
    },
  },
  choosenCurrency: {
    type: String,
    required: true,
    default: "EGP",
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  currentPoints: {
    type: Number,
    default:0
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "PreferenceTag",
      default: []
    }
  ],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: "ActivityCategory",
    required: true,
  }],
}, { timestamps: true });

const Tourist = mongoose.model("Tourist", touristSchema);
module.exports = Tourist;
