const bcrypt = require("bcrypt");
const Admin = require("../models/users/Admin.js");
const TourismGovernor = require("../models/users/TourismGovernor.js");
const Advertiser = require("../models/users/Advertiser.js");
const Tourist = require("../models/users/Tourist.js");
const TourGuide = require("../models/users/TourGuide.js");
const User = require("../models/users/User.js");
const Request = require('../models/Request.js')
const PromoCode = require("../models/PromoCode.js")
const Activity = require("../models/Activity");
const Itinerary = require("../models/Itinerary");
const Product = require("../models/Product");
const Seller = require("../models/users/Seller.js")


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
  const { role, userId } = req.params; 

  try {
      const user = await User.findOne({ userId }); // userid references tourist, seller etc
      console.log(user) 
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      if (role === "Advertiser") {
          const hasBookedActivities = await Activity.exists({ advertiser: userId, bookings: { $ne: [] }, date: { $gt: new Date() } });
          if (hasBookedActivities) {
              return res.status(400).json({ message: "Cannot request deletion. Advertiser has booked activities." });
          }
      }
      
      if (role === "Tour Guide") {
          const hasBookedItineraries = await Itinerary.exists({ tourGuide: userId, bookings: { $ne: [] }, endDate: { $gt: new Date() } });
          if (hasBookedItineraries) {
              return res.status(400).json({ message: "Cannot request deletion. Tour Guide has booked itineraries." });
          }
      }

      if (role === "Tourist") {
          const hasFutureBookedActivities = await Activity.exists({
              "bookings.touristId": userId,
              date: { $gt: new Date() }
          });
          const hasFutureBookedItineraries = await Itinerary.exists({ "bookings.touristId": userId, endDate: { $gt: new Date() } });

          if (hasFutureBookedItineraries || hasFutureBookedActivities) {
              return res.status(200).json({ message: "Cannot request deletion. You have upcoming bookings, cancel them first " });

          }
      }
      switch (role) {
          case "Tour Guide":
              // await Itinerary.updateMany({ tourGuide: userId }, { $set: { isActive: false } });
              await Itinerary.deleteMany({ tourGuide: userId, endDate: { $gt: new Date() } });
              await TourGuide.findByIdAndDelete(userId)
              break;
          case "Advertiser":
              await Activity.deleteMany({ advertiser: userId, date: { $gt: new Date() } });
              await Advertiser.findByIdAndDelete(userId)
              break;
          case "Seller": 
              await Product.deleteMany({ seller: userId });
              await Seller.findByIdAndDelete(userId);
              break;
          case "Tourist": 
              await Tourist.findByIdAndDelete(userId)
              break;
          case "Tourism Governor": 
              await TourismGovernor.findByIdAndDelete(userId)
              break;
          case "Admin": 
              await Admin.findByIdAndDelete(userId)
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


const getPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find()
    res.status(201).json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDataForEventOwner = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId }, 'userName email');
    if (!user) 
      return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({userName: user.userName,email: user.email});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTotalUsersCount= async(req,res)=>{
  try{
    const totalUsers = await User.countDocuments();
    res.status(200).json(totalUsers);
  }
  catch(error){
      res.status(500).json({ message: 'Server error', error: error.message });
    
  }
}

const getUsersPerMonth= async (req,res)=>{
  try{
      const {searchYear}=req.params;
      var count=[0,0,0,0,0,0,0,0,0,0,0,0];
      const users = await User.find();
      
      users.forEach((user)=>{
        var year=user.timestamp.getFullYear();
        var month=user.timestamp.getMonth();
        if (year==searchYear){
          count[--month]++;
      
        }

      })
      res.status(200).json(count);
  }
  catch(error){
    res.status(500).json({ message: 'Server error', error: error.message });

  }
}

const getAdminNotifications = async (req, res) => {
  try {
    const userid=req.userId;
    const admin = await Admin.findById(userid);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json(admin.notificationList);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { addAdmin, deleteUser, getAllUsers, createPromoCode,getPromoCodes, getDataForEventOwner,getTotalUsersCount,getUsersPerMonth, getAdminNotifications };
