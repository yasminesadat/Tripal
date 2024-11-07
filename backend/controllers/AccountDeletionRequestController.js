const AccountDeletionRequest = require("../models/AccountDeletionRequest");
const Activity = require("../models/Activity");
const Itinerary = require("../models/Itinerary"); 
const User = require("../models/users/User");
const Product = require("../models/Product"); 

const requestAccountDeletion = async (req, res) => {
    const { role, userId } = req.params; 
    
    try {
        const existingRequest = await AccountDeletionRequest.findOne({ user: userId, status: "Pending" });
        if (existingRequest) {
        return res.status(400).json({ message: "A pending deletion request already exists." });
        }

        if (role === "Advertiser") {
            const hasBookedActivities = await Activity.exists({ advertiser: userId, date: { $gt: new Date() }, booked: true });
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

        const deletionRequest = new AccountDeletionRequest({
            user: userId,
            role,
            requestDate: new Date(),
            status: "Pending",
        });

        await deletionRequest.save();
        return res.status(200).json({ message: "Account deletion request submitted successfully." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};  

// admin
const approveDeletionRequest = async (req, res) => {
  const { requestId } = req.params; 

  try {
    const deletionRequest = await AccountDeletionRequest.findById(requestId);
    if (!deletionRequest) {
      return res.status(404).json({ message: "Deletion request not found." });
    }

    if (deletionRequest.status !== "Pending") {
      return res.status(400).json({ message: "This request has already been processed." });
    }

    const { user: userId, role } = deletionRequest;

    if (role === "Advertiser") {
      await Activity.deleteMany({ advertiser: userId });
    } else if (role === "TourGuide") {
      await Itinerary.deleteMany({ tourGuide: userId });
    } else if (role === "Seller") {
      await Product.deleteMany({ seller: userId });
    }

    const user = await User.findById(userId); 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    await user.deleteOne(); 

    deletionRequest.status = "Approved";
    deletionRequest.reviewedDate = new Date();
    await deletionRequest.save();

    return res.status(200).json({ message: "Account deletion approved and related data removed." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


const getDeletionRequests = async (req, res) => {
  try {
    const deletionRequests = await AccountDeletionRequest.find({ status: "Pending" })

    return res.status(200).json({ deletionRequests });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  requestAccountDeletion,
  approveDeletionRequest,
  getDeletionRequests
};
