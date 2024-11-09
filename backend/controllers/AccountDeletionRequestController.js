const AccountDeletionRequest = require("../models/AccountDeletionRequest");
const Activity = require("../models/Activity");
const Itinerary = require("../models/Itinerary"); 
const User = require("../models/users/User");
const Product = require("../models/Product"); 

const requestAccountDeletion = async (req, res) => {
  const { role, userId } = req.params; 
  
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role === "Advertiser") {
      const hasBookedActivities = await Activity.exists({ advertiser: userId, bookings: { $ne: [] }, date: { $gt: new Date() } });
      if (hasBookedActivities) {
        return res.status(400).json({ message: "Cannot request deletion. Advertiser has booked activities." });
      }
    } 
    else if (role === "TourGuide") {
      const hasBookedItineraries = await Itinerary.exists({ tourGuide: userId, "bookings.selectedDate": { $gt: new Date() } });
      if (hasBookedItineraries) {
        return res.status(400).json({ message: "Cannot request deletion. Tour Guide has booked itineraries." });
      }
    } 

    switch (role) {
      case "TourGuide":
        await Itinerary.updateMany( { tourGuide: userId }, { $set: { deactivated: true } });
        await Itinerary.deleteMany( { tourGuide: userId, "bookings.selectedDate": { $gt: new Date() } });
        await TourGuide.findByIdAndDelete(id)
        break;
      case "Advertiser":
        await Activity.updateMany( { advertiser: userId }, { $set: { deactivated: true } });
        await Activity.deleteMany( { advertiser: userId, date: { $gt: new Date() } });
        await Advertiser.findByIdAndDelete(id)
        break;
      case "Seller":
        await Product.deleteMany({ seller: userId });
        await Seller.findByIdAndDelete(id)
        break;
      case "Tourist":
        await Tourist.findByIdAndDelete(id)
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }
    await User.deleteOne({ userId });

    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};  

module.exports = {
  requestAccountDeletion,
};
