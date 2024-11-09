const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Request = require("../models/Request.js");
const User = require('../models/users/User.js')
const Seller = require('../models/users/Seller.js')
const TourGuide = require('../models/users/TourGuide.js')
const Advertiser = require('../models/users/Advertiser.js')
const Activity = require("../models/Activity");
const Itinerary = require("../models/Itinerary"); 
const Product = require("../models/Product"); 

const createRequest = async (req, res) => {
    const { userName, email, password, role } = req.body;

    try {
        if (!userName || !email || !password || !role) {
            return res.status(406).json({ error: 'All fields are required!' });
        }

        // Check unique userName across all users
        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Check unique email across all users
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const existingUserNameRequests = await Request.findOne({
            userName,
            status: { $ne: 'rejected' }
        });
        if (existingUserNameRequests) {
            return res.status(400).json({ error: "Request has been submitted with this username" });
        }

        const existingEmailRequests = await Request.findOne({ email, status: { $ne: 'rejected' } });
        if (existingEmailRequests) {
            return res.status(400).json({ error: "Request has been submitted with this email" });
        }



        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // const storage = getStorage(firebaseInstance); // Correctly getting the storage instance
        // console.log("IN BACKEND IM PRINTING THE DOCUMENT", document.name);
        // const fileName = new Date().getTime() + "_" + document.originalname; // Concatenating the timestamp and original filename
        // console.log("IN BACKEND IM PRINTING THE DOCUMENT", document.originalname);
        // const storageRef = ref(storage, "newSellerDocument"); // Creating a reference to the file in Firebase Storage
        // await uploadBytesResumable(storageRef, document.get('document'));
        // const url = await getDownloadURL(storageRef); // Getting the download URL
        // console.log("the firebase backend url is", url);
        // console.log("the backend document ", document.get('document'));
        // // Create request with document URL in MongoDB
        const createdRequest = await Request.create({
            userName,
            email,
            password: hashedPassword,
            role
            // document: url // Store the Firebase URL in the MongoDB document field
        });
        res.status(201).json(createdRequest);
    } catch (error) {
        // Return a 400 response with the error message
        res.status(400).json({ error: error.message });
    }
};

const getRequests = async (req, res) => {
    try {
        const reqs = await Request.find();

        if (reqs.length === 0) {
            return res.status(404).json('No requests found');
        }

        res.status(200).json(reqs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        return res.status(200).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const req = await Request.findByIdAndDelete(id);

        return res.status(200).json('request deleted successfully')
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateRequest = async (req, res) => {
    const { id } = req.params;
    const { document } = req.body
    console.log(document);
    try {
        const updatedRequest = await Request.findByIdAndUpdate(id, { "document": document }, { new: true });


        return res.status(200).json(updatedRequest)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const setRequestState = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log("The new status is", status);

    try {
        // Properly update the status field
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: "Request not found" });
        }

        if (status === "accepted") {
            const role = updatedRequest.role;
            console.log("Role", role);
            const object = {
                "userName": updatedRequest.userName,
                "email": updatedRequest.email,
                "password": updatedRequest.password
            };
            console.log("Data to create with", object);

            // Create the appropriate user based on role
            switch (role) {
                case 'Seller':
                    const seller = await Seller.create(object);
                    await User.create({
                        userId: seller._id,
                        userName: seller.userName,
                        email: seller.email,
                        role: "Seller",
                    });
                    console.log('Handling action for Seller');
                    break;

                case 'Tour Guide':
                    const tourGuide = await TourGuide.create(object);
                    await User.create({
                        userId: tourGuide._id,
                        userName: tourGuide.userName,
                        email: tourGuide.email,
                        role: "Tour Guide"
                    });
                    console.log('Handling action for Tour Guide');
                    break;

                case 'Advertiser':
                    const advertiser = await Advertiser.create(object);
                    await User.create({
                        userId: advertiser._id,
                        userName: advertiser.userName,
                        email: advertiser.email,
                        role: "Advertiser"
                    });
                    console.log('Handling action for Advertiser');
                    break;
            }
        }

        return res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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
    createRequest,
    getRequests,
    deleteRequest,
    getRequestById,
    setRequestState,
    updateRequest,
    requestAccountDeletion
}
