const express = require("express");
const router = express.Router(); 
const {
  getProducts,
  createProduct,
  searchProductsByName,
  filterProductsByPrice,
  sortProductsByRatings,
  editProduct,
  archiveProduct,
  unArchiveProduct,
} = require("../controllers/ProductController");
const validateIDs = require("../middleware/IDMiddleware");
const { addRating, getRatings } = require("../controllers/RatingController"); 
const Product = require("../models/Product"); 
const ProductRating = require("../models/ProductRating");

router.post("/products", validateIDs(["sellerID"]), createProduct);
router.get("/products", getProducts);
router.get("/products/search", searchProductsByName);
router.get("/products/filter", filterProductsByPrice);
router.get("/products/sort", sortProductsByRatings);
router.patch("/products/:id", validateIDs(["id"]), editProduct);
router.post("/products/:id/ratings", validateIDs(["id", "userID"]), addRating(Product, ProductRating, 'productID'));
router.get("/products/:id/ratings", validateIDs(["id"]), getRatings(Product, ProductRating, 'productID'));
router.patch("/products/:id/archive", validateIDs(["id"]), archiveProduct);
router.patch("/products/:id/unarchive", validateIDs(["id"]), unArchiveProduct);

module.exports = router;
