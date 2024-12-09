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
    required: true
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
    default: 0
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
  bookedFlights: [
    {
      _id: false,
      flightNumber: { type: String, required: true },
      airline: { type: String, required: true },
      departureTime: { type: Date, required: true },
      arrivalTime: { type: Date, required: true },
      origin: { type: String, required: true },
      destination: { type: String, required: true },
      price: { type: String, required: true },
      currency: { type: String, default: "USD" },
      bookingDate: { type: Date, default: Date.now }
    }
  ],
  bookedHotels: [{
    type: Schema.Types.ObjectId
  }],
  deliveryAddresses: [
    {
      _id: false,
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  ],
  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: {type: Number, required: true},
    },
  ],
  wishlist:[{
    type: Schema.Types.ObjectId,
    ref: "Product",
  }],
  promoCodes: [{
    type: Schema.Types.ObjectId,
    ref: "PromoCode",
  }],
  notificationList: [{
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    notifType: String
  }],
  bookmarkedActivities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity", default: [] }],
  bookmarkedItineraries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Itinerary", default: [] }],
  isFirstTime: { type: Boolean, default: true },
}, { timestamps: true });

touristSchema.methods.calculateAge = function () {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();

  const isBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!isBirthdayPassed) {
    age -= 1;
  }

  return age;
};

const Tourist = mongoose.model("Tourist", touristSchema);
module.exports = Tourist;