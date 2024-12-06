const tourGuideModel = require("../models/users/TourGuide.js");
const bcrypt = require("bcrypt");
const cloudinary = require("../cloudinary");

const createTourGuide = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !password || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const existingName = await tourGuideModel.findOne({ userName });
    if (existingName) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const existingEmail = await tourGuideModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const tourGuide = await tourGuideModel.create({
      userName: userName,
      email: email,
      password: hashedPassword,
    });
    const id = tourGuide._id;
    res.status(201).json(tourGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTourguideInfo = async (req, res) => {
  try {
    const tourGuide = await tourGuideModel.findById(req.userId);

    if (!tourGuide) {
      return res.status(404).json({ error: "Tour Guide not found" });
    }

    res.status(200).json(tourGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTourguideNotifications = async (req, res) => {
  try {
    const userid=req.userId;
    const tourGuide = await tourGuideModel.findById(userid);

    if (!tourGuide) {
      return res.status(404).json({ error: "Tour Guide not found" });
    }
    res.status(200).json(tourGuide.notificationList);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTourguideNotification = async (req, res) => {
  try {
    const userid=req.userId;
    const notificationID=req.params;   
   
   
    const tourGuide = await tourGuideModel.findById(userid);
    if (!tourGuide) {
      return res.status(404).json({ error: "Tour Guide not found" });
    }
     
    
    const updatedNotificationList = tourGuide.notificationList.filter(
      notification => (notification._id).toString() !== notificationID.id
    );

    tourGuide.notificationList=updatedNotificationList;
    await tourGuide.save();
    
    
    res.status(200).json(tourGuide.notificationList);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const userid=req.userId;
    const notificationID=req.params;   
   
   
    const tourGuide = await tourGuideModel.findById(userid);
    if (!tourGuide) {
      return res.status(404).json({ error: "Tour Guide not found" });
    }
     
   
    const notification = tourGuide.notificationList.find(
      notification => (notification._id).toString() === notificationID.id
    );

    notification.read=true;

    
    await tourGuide.save();

    console.log(tourGuide.notificationList)
    
    
    res.status(200).json(tourGuide.notificationList);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTourguideData = async (req, res) => {
  try {
    const id = req.userId;
    const { currProfilePicture, initialProfilePicture, ...data } = req.body;

    if (initialProfilePicture) {
      try {
        const oldPicturePublicId = initialProfilePicture
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        // Delete old picture
        await cloudinary.uploader.destroy(oldPicturePublicId);
        data.profilePicture = "";
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Failed to delete old profile picture" });
      }
    }

    if (currProfilePicture) {
      try {
        result = await cloudinary.uploader.upload(currProfilePicture, {
          folder: "tourGuideProfilePictures",
        });
        data.profilePicture = result.secure_url;
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Failed to upload new profile picture" });
      }
    }

    const updatedTourGuide = await tourGuideModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedTourGuide) {
      return res.status(404).json("Tour Guide not found");
    }

    return res.status(200).json({ updatedTourGuide });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { createTourGuide, updateTourguideData, getTourguideInfo, getTourguideNotifications, deleteTourguideNotification,markNotificationRead };