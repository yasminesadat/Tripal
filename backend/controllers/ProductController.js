const Product = require("../models/Product.js");
const { default: mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  const { name, seller, price, description, quantity, picture } = req.body;

  if (!name || !seller || !price || !description || !quantity || !picture) {
    res.status(400);
    throw new Error("Please type all fields");
  }

  if (!mongoose.Types.ObjectId.isValid(seller)) {
    throw new Error("Invalid sellerID");
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
  if (products.length === 0) {
    res.status(404);
    throw new Error("No products found");
  }
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

  if (products.length === 0) {
    res.status(404);
    throw new Error("No products found");
  }

  res.status(200).json(products);
});

const filterProductsByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  const products = await Product.find({
    price: { $gte: minPrice, $lte: maxPrice }, //greater and less than or equal
  });
  if (products.length === 0) {
    res.status(404);
    throw new Error("No products found");
  }
  res.json(products);
});

const sortProductsByRatings = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("ratings")
    .sort({ "ratings.value": -1 });
  res.json(products);
});

const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description, price } = req.body;
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { description, price },
    { new: true }
  );
  res.json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  searchProductsByName,
  filterProductsByPrice,
  sortProductsByRatings,
  editProduct,
};
