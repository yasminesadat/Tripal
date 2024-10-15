const sellerId = "67092b1651baf2ce64114a26";
const tourismGovernerID = "6703aa9d78a7632a67a38dfe";
const adminId = "670c3f8b4d912d42ccf5580c";
const touristId = "670d4e900cb9ea7937cc9968";
const advertiserID = "670c57b8b8b7301413bb4cc0";

//mimics what will be in token to adjust some component
// features based on it
//change to test different roles in the website
const currUser = touristId;
const userRole = "Tourist"; //used to test [Admin, Tourist, Seller]

module.exports = {
  currUser,
  userRole,
  sellerId,
  tourismGovernerID,
  adminId,
  touristId,
  advertiserID,
};
