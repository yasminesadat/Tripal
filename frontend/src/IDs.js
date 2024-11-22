
const sellerId = "6731210c5c9f25a14ca3d774"; // NEW 
const tourismGovernerID = "673121604f3b1a3689b48996"; //NEW
const adminId = "67311e1f5c9f25a14ca3d72f"; //NEW
const touristId = "6731273143b77aa2173f2d15"; // NEW
const touristId2 = "6727661b46a8937e2e821782"; // DONT DELETE age < 18
const advertiserID = "673121105c9f25a14ca3d779"; // NEW 
const tourGuideID = "6731210a5c9f25a14ca3d76f";



//mimics what will be in token to adjust some component
// features based on it
//change to test different roles in the website
const currUser = touristId;
const userRole = "Tourist"; //used to test [Admin, Tourist, Seller, Tour Guide, Advertiser]
module.exports = {
  currUser,
  userRole,
  sellerId,
  tourismGovernerID,
  adminId,
  touristId,
  touristId2,
  advertiserID,
  tourGuideID

};

