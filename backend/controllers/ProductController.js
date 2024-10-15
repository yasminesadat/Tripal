const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../cloudinary");

const Product = require("../models/Product.js");
const Rating = require("../models/Rating");
const Tourist = require("../models/users/Tourist.js");
const Seller = require("../models/users/Seller.js");

const createProduct = asyncHandler(async (req, res) => {
  const { name, sellerID, price, description, quantity, picture } = req.body;

  const seller = await Seller.findById(sellerID);
  if (!seller) {
    return res.status(404).json({ error: "Seller not found" });
  }

  let result;
  try {
    result = await cloudinary.uploader.upload(picture, {
      folder: "products",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to upload picture" });
  }

  const product = await Product.create({
    name,
    seller,
    price,
    description,
    quantity,
    picture: result.secure_url,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400).json({ error: "Invalid product data" });
  }
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("seller")
    .populate({
      path: "ratings",
      populate: {
        path: "userID", // Populating the userID field
        select: "userName", // Select only the userName field (or add more if needed)
      },
    });
  res.status(200).json(products);
});

const searchProductsByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const products = await Product.find({
    name: { $regex: new RegExp(`${name}`, "i") },
  });

  res.status(200).json(products);
});

const filterProductsByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  if (!minPrice && !maxPrice) {
    return res
      .status(400)
      .json({ error: "At least one value should be provided" });
  }

  const query = {};

  if (minPrice) {
    query.price = { ...query.price, $gte: minPrice };
  }

  if (maxPrice) {
    query.price = { ...query.price, $lte: maxPrice };
  }

  const products = await Product.find(query);
  res.status(200).json(products);
});

const sortProductsByRatings = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ averageRating: -1 });
  res.json(products);
});

const editProduct = asyncHandler(async (req, res) => {
  const { name, price, description, quantity, picture, initialPicture } =
    req.body;
  let result;

  if (picture) {
    try {
      if (initialPicture) {
        const oldPicturePublicId = initialPicture
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        // Delete old picture
        await cloudinary.uploader.destroy(oldPicturePublicId);
      }

      result = await cloudinary.uploader.upload(picture, {
        folder: "products",
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update picture" });
    }
  }

  const updateData = {
    name,
    price,
    description,
    quantity,
  };

  if (result && result.secure_url) {
    updateData.picture = result.secure_url;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true } // Options: return updated document, run validation
  );

  if (!updatedProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json({ status: "success", data: updatedProduct });
});

const addRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review, userID } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const tourist = await Tourist.findById(userID);
  if (!tourist) {
    return res.status(404).json({ error: "User not found" });
  }

  const newRating = new Rating({
    rating,
    review,
    userID,
  });

  await newRating.save();

  product.ratings.push(newRating._id);

  const ratings = product.ratings;
  const newAverage =
    product.averageRating * ((ratings.length - 1) / ratings.length) +
    rating / ratings.length;

  product.averageRating = newAverage;

  await product.save();

  res.status(201).json({
    error: "Rating added successfully",
    rating: newRating,
    newAverage: newAverage,
  });
});

module.exports = {
  createProduct,
  getProducts,
  searchProductsByName,
  filterProductsByPrice,
  sortProductsByRatings,
  editProduct,
  addRating,
};
