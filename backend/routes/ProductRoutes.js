const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  searchProductsByName,
  filterProductsByPrice,
  sortProductsByRatings,
  editProduct,
  addRating,
} = require("../controllers/ProductController");

const validateID = require("../middleware/IDMiddleware");

router.get("/products", getProducts);
router.post("/products", createProduct);
router.get("/products/search", validateID, searchProductsByName);
router.get("/products/filter", filterProductsByPrice);
router.get("/products/sort", sortProductsByRatings);
router.patch("/products/:id", validateID("id"), editProduct);
router.post("/products/:id/rate", validateID("id"), addRating);

module.exports = router;
