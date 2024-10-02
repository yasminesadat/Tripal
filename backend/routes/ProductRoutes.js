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

router.post("/products", validateID(["sellerID"]), createProduct);
router.get("/products", getProducts);
router.get("/products/search", searchProductsByName);
router.get("/products/filter", filterProductsByPrice);
router.get("/products/sort", sortProductsByRatings);
router.patch("/products/:id", validateID(["id"]), editProduct);
router.post("/products/:id/rate", validateID(["id", "userID"]), addRating);

module.exports = router;
