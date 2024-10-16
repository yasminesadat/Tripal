const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Import the Product model
const ProductRating = require("../models/ProductRating"); // Import the ProductRating model
const {
  getProducts,
  createProduct,
  searchProductsByName,
  filterProductsByPrice,
  sortProductsByRatings,
  editProduct,
} = require("../controllers/ProductController");
const { addRating, getRatings } = require("../controllers/RatingController"); // Import both addRating and getRatings
const validateIDs = require("../middleware/IDMiddleware");

router.post("/products", validateIDs(["sellerID"]), createProduct);
router.get("/products", getProducts);
router.get("/products/search", searchProductsByName);
router.get("/products/filter", filterProductsByPrice);
router.get("/products/sort", sortProductsByRatings);
router.patch("/products/:id", validateIDs(["id"]), editProduct);
router.post("/products/:id/rate", validateIDs(["id", "userID"]), addRating(Product, ProductRating, 'productID'));
router.get("/products/:id/ratings", validateIDs(["id"]), getRatings(Product, ProductRating, 'productID'));

module.exports = router;
