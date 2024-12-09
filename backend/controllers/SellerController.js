const Seller = require("../models/users/Seller.js");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../cloudinary");

const createSeller = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !password || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const existingName = await Seller.findOne({ userName });
  if (existingName) {
    return res.status(409).json({ error: "Username already exists" });
  }

  const existingEmail = await Seller.findOne({ email });
  if (existingEmail) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const sellernew = await Seller.create({
    userName: userName,
    email: email,
    password: hashedPassword,
  });
  
  res.status(201).json(sellernew);
});

const readSellerData = asyncHandler(async (req, res) => {
  try{
  const id =  req.userId;
  const seller = await Seller.findById(id);
  if (!seller) {
    return res.status(404).json({ error: "Seller not found" });
  }
  res.status(200).json({ status: "success", data: seller });
}
catch (error) {
  return res.status(400).json({ error: error.message });
}
});

const updateSellerData = asyncHandler(async (req, res) => {
  const { initialLogo, currLogo, ...updateData } = req.body;
  let result;

  if (initialLogo) {
    try {
      const oldPicturePublicId = initialLogo
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(oldPicturePublicId);
      updateData.logo = "";
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete old logo" });
    }
  }

  if (currLogo) {
    try {
      result = await cloudinary.uploader.upload(currLogo, {
        folder: "sellerLogos",
      });
      updateData.logo = result.secure_url;
    } catch (error) {
      return res.status(500).json({ error: "Failed to upload new logo" });
    }
  }

  const updatedSeller = await Seller.findByIdAndUpdate(
    req.userId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedSeller) {
    return res.status(404).json({ error: "Seller not found" });
  }

  res.status(200).json({ status: "success", data: updatedSeller });
});


const getSellerNotifications = async (req, res) => {
  try {
    const userid=req.userId;
    const seller = await Seller.findById(userid);
    console.log("hi1")

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.status(200).json(seller.notificationList);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const markNotificationSeller = async (req, res) => {
  try {
    const userid=req.userId;
  
    const seller = await Seller.findById(userid);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }   

    seller.notificationList.forEach((n)=>{(n.read=true)})

    await seller.save();
    
    res.status(200).json(seller.notificationList);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createSeller, readSellerData, updateSellerData,getSellerNotifications,markNotificationSeller };
