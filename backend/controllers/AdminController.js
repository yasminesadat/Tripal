const bcrypt = require("bcrypt");
const Admin = require("../models/users/Admin.js");
const TourGuide = require("../models/users/TourGuide.js");
const Seller = require("../models/users/Seller.js");
const Advertiser = require("../models/users/Advertiser.js");
const Tourist = require("../models/users/Tourist.js");
const TourismGovernor = require("../models/users/TourismGovernor.js");
const User = require("../models/users/User.js");
const Request = require('../models/Request.js')
const PromoCode = require("../models/PromoCode.js")
const Activity = require("../models/Activity");
const Itinerary = require("../models/Itinerary");
const Product = require("../models/Product");

const addAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ error: "Missing required fields: username and password" });
    }

    //check unique userName across all users
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingUserNameRequests = await Request.findOne({
      userName,
      status: { $ne: 'rejected' }
    });
    if (existingUserNameRequests) {
      return res.status(400).json({ error: "Request has been submitted with this username" });
    }



    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      userName: req.body.userName,
      password: hashedPassword,
    });

    await User.create({
      userId: newAdmin._id,
      userName: newAdmin.userName,
      role: "Admin"
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};


const deleteUser = async (req, res) => {
  const { role, userId } = req.params;  // role Tourist , etc userId is the id from the tourist table 
  console.log("role",role,"userid",userId);

  try {
      const user = await User.findOne({ userId }); // userid references tourist, seller etc 
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      if (role === "Advertiser") {
          // has future bookd activities , should be held accountable for them
          const hasBookedActivities = await Activity.exists({ advertiser: userId, bookings: { $ne: [] }, date: { $gt: new Date() } });
          if (hasBookedActivities) {
              return res.status(400).json({ message: "Cannot request deletion. Advertiser has booked activities." });
          }
      }
      else if (role === "TourGuide") {
          // if he has one itienrary with future bookings 
          const hasBookedItineraries = await Itinerary.exists({ tourGuide: userId, "bookings.selectedDate": { $gt: new Date() } });
          if (hasBookedItineraries) {
              return res.status(400).json({ message: "Cannot request deletion. Tour Guide has booked itineraries." });
          }
      }
      else if (role === "Tourist") {
          const hasFutureBookedActivities = await Activity.exists({
              "bookings.touristId": userId,
              date: { $gt: new Date() }
          });
          const hasFutureBookedItineraries = await Itinerary.exists({ "bookings.touristId": userId, "bookings.selectedDate": { $gt: new Date() } });

          if (hasFutureBookedItineraries || hasFutureBookedActivities) {
              return res.status(400).json({ message: "Cannot request deletion. You have upcoming bookings, cancel them first " });

          }
      }
     // console.log("hi1");
      switch (role) {
          case "TourGuide":
              //   await Itinerary.updateMany( { tourGuide: userId }, { $set: { isActive: true } });
              //  itinerary 3ndaha booking 10/3/2024 w 10/12/2024 causes a problem : 
              //should be visible in history for the old person but not visible for the upcoming person
              await Itinerary.updateMany({ tourGuide: userId }, { $set: { isActive: false } }); // deactivate all
              // , handle in controller functions when to view which (history vs upcoming)

              await Itinerary.deleteMany({ tourGuide: userId, "bookings.selectedDate": { $gt: new Date() } });
              await TourGuide.findByIdAndDelete(userId)
              break;
          case "Advertiser":
              //   await Activity.updateMany( { advertiser: userId }, { $set: { deactivated: true } });
              await Activity.deleteMany({ advertiser: userId, date: { $gt: new Date() } }); // deletes new activities only and old ones remain as is, controlled
              // by the display of upcoming activities only so to RETAIN THE HISTORY
              await Advertiser.findByIdAndDelete(userId)
              break;
          case "Seller": // deletes seller and associated products
             // console.log("hiA");
              await Product.deleteMany({ seller: userId });
            //  console.log("hiB");
              await Seller.findByIdAndDelete(userId);
              break;
          case "Tourist": // deletes tourist without any restrictions
              // check that we have no future activities that are booked
              await Tourist.findByIdAndDelete(userId)
              break;
          case "Tourism Governor": // deletes tourist without any restrictions
              // check that we have no future activities that are booked
              await TourismGovernor.findByIdAndDelete(userId)
              break;
          case "Admin": // deletes tourist without any restrictions
              // check that we have no future activities that are booked
              await Admin.findByIdAndDelete(userId)
              break;
          default:
              return res.status(400).json({ message: "Invalid role" });
      }
     
      await User.deleteOne({ userId }); // deletes from the user table 
//console.log("hi3");
      return res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};

// const deleteUser = async (req, res) => {
//   console.log("I came here")
//   const { id } = req.params; // THIS ID IS ALRIGHT HERE KEEP 

//   try {
//     const correspondingUser = await User.find({ userId: id }) // Ensure to await the promise

//     console.log("I deleted from user", correspondingUser)
//     if (!correspondingUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const role = correspondingUser[0].role;
//     console.log("Role is", role);
//     switch (role) {
//       // case "Tour Guide":
//       //   await TourGuide.findByIdAndDelete(id)
//       //   break;
//       // case "Advertiser":
//       //   await Advertiser.findByIdAndDelete(id)
//       //   break;
//       // case "Seller":
//       //   await Seller.findByIdAndDelete(id)
//       //   break;
//       // case "Tourist":
//       //   await Tourist.findByIdAndDelete(id)
//       //   break;
//       case "Tourism Governor":
//         await TourismGovernor.findByIdAndDelete(id)
//         break;
//       case "Admin":
//         await Admin.findByIdAndDelete(id)
//         break;
//       default:
//         return res.status(400).json({ message: "Invalid role" });
//     }

//     // Proceed with deleting the user
//     await User.deleteOne({ userId: id });
//     return res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };



const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({})
    res.status(200).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const createPromoCode = async (req, res) => {
  try {
    const { name, discountPercentage } = req.body;

    const newPromoCode = new PromoCode({
      name,
      discountPercentage
    });

    await newPromoCode.save();


    res.status(201).json({ promoCode: newPromoCode });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { addAdmin, deleteUser, getAllUsers, createPromoCode };
