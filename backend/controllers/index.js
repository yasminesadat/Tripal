// controllers/index.js
const TourGuideController = require('./TourGuideController');
const SellerController = require('./SellerController');
const AdvertiserController = require('./AdvertiserController');

// these ... spreads all exports in each controller file so they can all be like a 1d list
module.exports = {
  ...TourGuideController,
  ...SellerController,
  ...AdvertiserController
};