const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const Product = require("../models/Product.js");
const Rating = require("../models/Rating");
const Tourist = require("../models/Tourist.js");
const Seller = require("../models/Seller.js");

const createProduct = asyncHandler(async (req, res) => {
  const { name, sellerID, price, description, quantity, picture } = req.body;

  const seller = await Seller.findById(sellerID);
  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }
  const product = await Product.create({
    name,
    seller,
    price,
    description,
    quantity,
    picture,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("seller").populate("reviews");
  res.status(200).json(products);
});

const searchProductsByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  if (!name) {
    res.status(400);
    throw new Error("Product name is required");
  }

  const products = await Product.find({
    name: { $regex: new RegExp(`${name}`, "i") }, //match name anywhere in string
  });

  res.status(200).json(products);
});

const filterProductsByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  if (!minPrice && !maxPrice) {
    res.status(400);
    throw new Error("At least one value should be provided");
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
  const { id } = req.params;
  const { description, price } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (!description && !price) {
    res.status(400);
    throw new Error("At least one value should be provided");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { description, price },
    { new: true }
  );

  res.status(200).json(updatedProduct);
});

const addRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review, user } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User is required");
  }

  if (!mongoose.Types.ObjectId.isValid(user)) {
    res.status(400);
    throw new Error("Invalid userID");
  }

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const tourist = await Tourist.findById(user);
  if (!tourist) {
    res.status(404);
    throw new Error("User not found");
  }

  const newRating = new Rating({
    rating,
    review,
    user,
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
    message: "Rating added successfully",
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
