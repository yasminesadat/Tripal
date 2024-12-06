const express = require("express");
const router = express.Router();
const Tourist = require("../models/users/Tourist.js");
const validateIDs = require("../middleware/IDMiddleware");
const { getRandomPromoCode } = require("../controllers/TouristController.js");

const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");
const {
  createTourist,
  updateTouristProfile,
  getTouristInfo,
  redeemPoints,
  getTouristNameAndEmail,
  getTouristBookedFlights,
  getTouristAge,
  getTouristBookedHotels,
  getTouristPreferences,
  getTouristCategories,
  checkUserExists,
  bookmarkEvent,
  getBookmarkedEvents,
  saveProduct,
  getWishList,
  removeFromWishList,
  saveFlightBooking,
  completeFlightBooking, getTouristNotifications,
  addToCart,
  removeFromCart, checkTouristPromocode,
  getCart,

  getAddresses,
  addAddress,
  getWalletAndTotalPoints

} = require("../controllers/TouristController.js");
const { changePassword } = require("../controllers/PasswordController.js");

router.post("/createTourist", createTourist);
router.put(
  "/updateTourist",
  verifyToken,
  authorizeRoles("Tourist"),
  updateTouristProfile
);
router.get(
  "/getTouristInfo",
  verifyToken,
  authorizeRoles("Tourist", "Admin"),
  getTouristInfo
);
router.post(
  "/redeem",
  verifyToken,
  authorizeRoles("Tourist"),
  redeemPoints
);
router.put(
  "/tourist-change-pass",
  verifyToken,
  authorizeRoles("Tourist"),
  changePassword(Tourist)
);
router.get(
  "/tourist-name-email",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristNameAndEmail
);
router.get(
  "/tourist/flights",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristBookedFlights
);
router.get(
  "/tourist/age",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristAge
);
router.get(
  "/tourist/bookedHotels",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristBookedHotels
);
router.get(
  "/tourist/preferences",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristPreferences
);
router.get(
  "/tourist/categories",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristCategories
);

router.get(
  "/tourist/exists",
  verifyToken,
  checkUserExists
);

router.post(
  "/tourist/bookmark",
  verifyToken,
  authorizeRoles("Tourist"),
  bookmarkEvent
);

router.get(
  "/tourist/bookmarks",
  verifyToken,
  authorizeRoles("Tourist"),
  getBookmarkedEvents
);

router.post(
  "/tourist/save-product",
  verifyToken,
  authorizeRoles("Tourist"),
  saveProduct
);

router.get(
  "/tourist/wishlist",
  verifyToken,
  authorizeRoles("Tourist"),
  getWishList
);

router.post(
  "/tourist/remove-wishlist",
  verifyToken,
  authorizeRoles("Tourist"),
  removeFromWishList
);

router.post(
  "/tourist/cart",
  verifyToken,
  authorizeRoles("Tourist"),
  addToCart
);

router.delete(
  "/tourist/cart",
  verifyToken,
  authorizeRoles("Tourist"),
  removeFromCart
);

router.get(
  "/tourist/cart",
  verifyToken,
  authorizeRoles("Tourist"),
  getCart
);

router.post(
  "/tourist/book-flight",
  verifyToken,
  authorizeRoles("Tourist"),
  saveFlightBooking
);

router.post(
  "/tourist/flight-payment",
  verifyToken,
  authorizeRoles("Tourist"),
  completeFlightBooking
);

router.get(
  "/promoCode",

  getRandomPromoCode
);
router.get(
  "/tourist/notifications",
  verifyToken,
  authorizeRoles("Tourist"),
  getTouristNotifications
);

router.post(
  "/tourist/checkPromoCode",
  verifyToken,
  authorizeRoles("Tourist"),
  checkTouristPromocode
);

router.get(

  "/tourist/address",
  verifyToken,
  authorizeRoles("Tourist"),
  getAddresses
);

router.post(
  "/tourist/address",
  verifyToken,
  authorizeRoles("Tourist"),
  addAddress
);


  "/tourist/wallet",
  verifyToken,
  authorizeRoles("Tourist"),
  getWalletAndTotalPoints
);
module.exports = router;
