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
  revenue,
  getProductImages,
  isArchived,
  getProduct,
} = require("../controllers/ProductController");
const validateIDs = require("../middleware/IDMiddleware");
const { addRating, getRatings } = require("../controllers/RatingController");
const Product = require("../models/Product");
const ProductRating = require("../models/ProductRating");
const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.post("/products", verifyToken, authorizeRoles("Seller"), createProduct);
router.get("/products", getProducts);
router.get(
  "/product/:id",
  verifyToken,
  authorizeRoles("Tourist", "Seller", "Admin"),
  getProduct
);
router.get("/products/search", searchProductsByName);
router.get("/products/filter", filterProductsByPrice);
router.get("/products/sort", sortProductsByRatings);
router.patch(
  "/products/:id",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Seller"),
  editProduct
);
router.post(
  "/products/:id/ratings",
  validateIDs(["id", "userID"]),
  verifyToken,
  authorizeRoles("Tourist"),
  addRating(Product, ProductRating, "productID")
);
router.get(
  "/products/:id/ratings",
  validateIDs(["id"]),
  getRatings(Product, ProductRating, "productID")
);
router.patch(
  "/products/:id/archive",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Admin", "Seller"),
  archiveProduct
);
router.patch(
  "/products/:id/unarchive",
  validateIDs(["id"]),
  verifyToken,
  authorizeRoles("Admin", "Seller"),
  unArchiveProduct
);
router.get("/products/revenue", verifyToken, authorizeRoles("Seller"), revenue);

router.post(
  "/products/images",
  verifyToken,
  authorizeRoles("Tourist"),
  getProductImages
);

router.get(
  "/product/:id/isArchived",
  verifyToken,
  authorizeRoles("Tourist"),
  isArchived
);

module.exports = router;
