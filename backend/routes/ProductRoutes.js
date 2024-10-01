const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  searchProductsByName,
  filterProductsByPrice,
  sortProductsByRatings,
  editProduct,
} = require("../controllers/ProductController");

router.get("/products", getProducts);
router.post("/products", createProduct);
router.get("/products/search", searchProductsByName);
router.get("/products/filter", filterProductsByPrice);
router.get("/products/sort", sortProductsByRatings);
router.patch("/products/:id", editProduct);

module.exports = router;
