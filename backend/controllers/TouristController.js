const touristModel = require("../models/users/Tourist");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require('../models/users/User.js')
const Request = require('../models/Request.js');
const hotelBookings = require("../models/BookingHotel.js");
const activityModel = require("../models/Activity.js");
const itineraryModel = require("../models/Itinerary.js");
const productModel = require("../models/Product.js");
const PromoCode = require("../models/PromoCode.js")
const cron = require('node-cron');

cron.schedule('00 00 * * *', async () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const birthdayUsers = await touristModel.find({
    $expr: {
      $and: [
        { $eq: [{ $month: "$dateOfBirth" }, month] },
        { $eq: [{ $dayOfMonth: "$dateOfBirth" }, day] }
      ]
    }
  })


  for (const user of birthdayUsers) {
    try {
      const promocode = await getRandomPromoCode();
      const name = promocode.name;
      const discount = promocode.discountPercentage;

      const subject = `🎉 Happy Birthday from Tripal!`;
      const html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #5a9ea0;">Happy Birthday, ${user.userName}! 🎂</h1>

                        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h2 style="color: #036264; margin: 0;">🎁 Your Birthday Gift</h2>
                            <p style="font-size: 18px;">Enjoy <strong>${discount}% OFF</strong> your next adventure!</p>
                            <div style="background: #ffffff; padding: 15px; border-radius: 4px; text-align: center; margin: 15px 0;">
                                <p style="font-size: 24px; font-weight: bold; color: #5a9ea0; margin: 0;">
                                    ${name}
                                </p>
                            </div>
                            <p style="color: #666; font-size: 14px;">Valid for the next 24 hours</p>
                        </div>

                        <p>Don't miss out on this exclusive birthday offer! 
                            Book your next trip today and make your birthday month even more special.</p>

                        <p style="color: #666; font-size: 12px;">
                            * Promo code expires in 24 hours • Cannot be combined with other offers
                        </p>

                        <p style="margin-top: 30px;">
                            Happy Travels!<br/>
                            The Tripal Team ✈️
                        </p>
                    </div>
                `;

      await sendEmail(user.email, subject, html);
      user.promoCodes.push(promocode);
      user.notificationList.push({
        message: `Happy birthday! Use promo code ${name} for a discount of ${discount}%  today only!`,
        notifType: "birthday"
      });
      await user.save();
      console.log(`Birthday email sent to ${user.userName}`);
    } catch (error) {
      console.error(`Error processing birthday email for ${user.userName}:`, error.message);
      continue;
    }
  }
});

cron.schedule('59 23 * * *', async () => {

  const allUsers = await touristModel.find({});


  for (const user of allUsers) {
    try {



      user.promoCodes.length = 0;
      await user.save();
      console.log(`Cleared promo code: ( for ${user.userName}`);
    } catch (error) {
      console.error(`Error clearing promo code for ${user.userName}:`, error.message);
      continue;
    }
  }
});


const { sendEmail } = require('./Mailer');
const createTourist = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { userName, email, password, mobileNumber, nationality, dateOfBirth, job, tags = [], categories = [] } = req.body;

    // Check unique username across all users
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Check unique email across all users
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const existingUserNameRequests = await Request.findOne({
      userName,
      status: { $ne: 'rejected' }
    });
    if (existingUserNameRequests) {
      return res.status(400).json({
        error: "Request has been submitted with this username"
      });
    }
    //check unique email across all requests
    const existingEmailRequests = await Request.findOne({
      email,
      status: { $ne: 'rejected' }
    });
    if (existingEmailRequests) {
      return res.status(400).json({ error: "Request has been submitted with this email" });
    }
    // Validate required fields
    if (!userName || !email || !password || !mobileNumber || !nationality || !dateOfBirth || !job) {
      return res.status(400).json({ error: "Please add all fields" });
    }

    // Create tourist
    const tourist = await touristModel.create({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      mobileNumber: req.body.mobileNumber,
      nationality: req.body.nationality,
      dateOfBirth: req.body.dateOfBirth,
      job: req.body.job,
      tags,
      categories,
      wallet: {
        amount: 0,
        currency: "EGP"
      }
    });

    const id = tourist._id;

    // Create associated user role
    await User.create({
      userId: id,
      userName: tourist.userName,
      email: tourist.email,
      role: "Tourist"
    });

    return res.status(201).json(tourist);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getTouristInfo = async (req, res) => {
  try {
    const id = req.userId;

    // checks if the id is a valid one
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tourist ID",
      });
    }

    // retreives all the info beta3 el tourist by his id
    const touristInformation = await touristModel.findById(id);
    if (!touristInformation) {
      return res.status(404).json("Tourist profile doesn't exist");
    }


    return res.status(200).json(touristInformation);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateTouristProfile = async (req, res) => {
  try {
    const id = req.userId;
    const { tags, categories, bookedFlights, ...updateParameters } = req.body;

    if (tags) {
      updateParameters.tags = tags;
    }

    if (categories) {
      updateParameters.categories = categories;
    }

    if (updateParameters.userName) {
      res.status(400).json({
        status: "error",
        message: "You cannot update your username",
      });
    }
    if (updateParameters.walletBalance) {
      res.status(400).json({
        status: "error",
        message: "You cannot update your balance",
      });
    }
    if (updateParameters.dateOfBirth) {
      res.status(400).json({
        status: "error",
        message:
          "You cannot update your date of birth, dont you know when you were born??",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tourist ID",
      });
    }
    const touristToBeUpdated = await touristModel.findByIdAndUpdate(
      id,
      updateParameters,
      { new: true }
    );
    if (!touristToBeUpdated) {
      return res.status(404).json("Tourist profile doesnt exist");
    }

    if (bookedFlights && Array.isArray(bookedFlights)) {
      touristToBeUpdated.bookedFlights.push(...bookedFlights);
    }
    Object.assign(touristToBeUpdated, updateParameters);

    await touristToBeUpdated.save();

    return res
      .status(200)
      .json(touristToBeUpdated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.userId;
    const { oldPassword, newPassword } = req.body
    const hashedOldPassword = await bcrypt.hash(oldPassword, 10);

    const tourist = await touristModel.findById(id);
    if (hashedOldPassword != tourist.password)
      return res.status(400).json({ error: "current password is incorrect" });
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await updateTouristProfile(id, {
      "password": hashedNewPassword
    })
    return res.status(200).json("Successful");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getTouristNameAndEmail = async (req, res) => {
  const id = req.userId;

  try {
    const tourist = await touristModel.findById(id).select('userName email');

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    res.json({
      userName: tourist.userName,
      email: tourist.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const redeemPoints = async (req, res) => {
  try {
    const id = req.userId;

    const tourist = await touristModel.findById(id);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const amount = tourist.currentPoints - (tourist.currentPoints % 10000);
    tourist.wallet.amount = tourist.wallet.amount + amount * 100;
    tourist.currentPoints = tourist.currentPoints % 10000;

    await tourist.save();

    return res.status(200).json("Redemption successful");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getTouristBookedFlights = async (req, res) => {
  try {
    const id = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tourist ID",
      });
    }

    const tourist = await touristModel.findById(id).select('bookedFlights');
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    return res.status(200).json({ bookedFlights: tourist.bookedFlights });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getTouristBookedHotels = async (req, res) => {
  try {
    const id = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tourist ID",
      });
    }

    const tourist = await touristModel.findById(id).select('bookedHotels');
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }
    const bookedHotels = tourist.bookedHotels;
    if (!bookedHotels) {
      return res.status(400).json({ error: "No Booked Hotels!" });

    }
    const HotelInfo = [];

    for (let i = 0; i < bookedHotels.length; i++) {
      const hotel = await hotelBookings.findById(bookedHotels[i]._id);
      if (!hotel) {
        return res.status(404).json({ error: "Can't return hotels history!" });
      }
      HotelInfo.push(hotel)
    }

    return res.status(200).json({ bookedHotels: HotelInfo });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getTouristAge = async (req, res) => {
  try {
    const id = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid tourist ID format' });
    }

    const tourist = await touristModel.findById(id);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const age = tourist.calculateAge();
    res.json({ age });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tourist data', error });
  }
};

const checkUserExists = async (req, res) => {
  try {
    const id = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await touristModel.findById(id);

    if (!user) {
      res.json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User exists' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error checking user existence', error });
  }
};

const getTouristPreferences = async (req, res) => {
  try {
    const id = req.userId;
    const tourist = await touristModel.findById(id)
      .populate("tags")

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.json(tourist.tags);
  } catch (error) {
    console.error("Error fetching tourist information:", error);
    res.status(500).json({ message: "Error fetching tourists' tags" });
  }
};

const getTouristCategories = async (req, res) => {
  try {
    const id = req.userId;
    const tourist = await touristModel.findById(id)
      .populate("categories")

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.json(tourist.categories);
  } catch (error) {
    console.error("Error fetching tourist information:", error);
    res.status(500).json({ message: "Error fetching tourists' categories" });
  }
};

const bookmarkEvent = async (req, res) => {
  const touristId = req.userId;
  const { eventId, eventType } = req.body; // eventType can be activity or itinerary

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    let event;
    if (eventType === 'activity') {
      event = await activityModel.findById(eventId);
    } else if (eventType === 'itinerary') {
      event = await itineraryModel.findById(eventId);
    } else {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Add the event to the tourist's bookmarked list (depending on event type)
    const bookmarkArray = eventType === 'activity' ? 'bookmarkedActivities' : 'bookmarkedItineraries';
    if (!tourist[bookmarkArray].includes(eventId)) {   //prevents adding the same event more than once but should i handle removing bookmarked events?
      tourist[bookmarkArray].push(eventId);
      await tourist.save();
    }                           //if bookmarkArray is 'bookmarkedActivities' yeb2a tourist['bookmarkedActivities'] will be accessed

    // Add the tourist to the event's bookmarked list
    if (!event.bookmarked.includes(touristId)) {
      event.bookmarked.push(touristId);
      await event.save();
    }

    res.status(200).json({ message: 'Event bookmarked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getBookmarkedEvents = async (req, res) => {
  const touristId = req.userId; // Get the logged-in tourist's ID

  try {
    const tourist = await touristModel.findById(touristId)
      .populate("bookmarkedActivities")
      .populate("bookmarkedItineraries");

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const bookmarkedEvents = [
      ...tourist.bookmarkedActivities.map(activity => ({
        ...activity.toObject(),
        type: "activity"                   //so ik fel frontend which type it is 
      })),
      ...tourist.bookmarkedItineraries.map(itinerary => ({
        ...itinerary.toObject(),
        type: "itinerary"
      })),
    ];

    res.json(bookmarkedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// const removeBookmarkEvent = async (req, res) => {
//   const touristId = req.userId;
//   const { eventId, eventType } = req.body;

//   try {
//     const tourist = await touristModel.findById(touristId);
//     if (!tourist) {
//       return res.status(404).json({ error: 'Tourist not found' });
//     }

//     let event;
//     if (eventType === 'activity') {
//       event = await activityModel.findById(eventId);
//     } else if (eventType === 'itinerary') {
//       event = await itineraryModel.findById(eventId);
//     }

//     if (!event) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     // Remove event from tourist's bookmarked list
//     const bookmarkArray = eventType === 'activity' ? 'bookmarkedActivities' : 'bookmarkedItineraries';
//     tourist[bookmarkArray] = tourist[bookmarkArray].filter(id => id.toString() !== eventId.toString());
//     await tourist.save();

//     // Remove tourist from the event's bookmarked list
//     event.bookmarked = event.bookmarked.filter(id => id.toString() !== touristId.toString());
//     await event.save();

//     res.status(200).json({ message: 'Bookmark removed successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

const saveProduct = async (req, res) => {
  const touristId = req.userId;
  const { productId } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    let product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (tourist.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'You already have this product in your wishlist' });
    }

    tourist.wishlist.push(productId);
    await tourist.save();
    res.status(200).json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getWishList = async (req, res) => {
  const touristId = req.userId;

  try {
    const tourist = await touristModel.findById(touristId)
      .populate("wishlist")

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const wishlist = [
      ...tourist.wishlist.map(product => ({
        ...product.toObject(),
      })),
    ];

    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const removeFromWishList = async (req, res) => {
  const touristId = req.userId;
  const { productId } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);

    let product = await productModel.findById(productId);


    tourist.wishlist = tourist.wishlist.filter(id => id.toString() !== productId.toString());
    await tourist.save();

    res.status(200).json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
const getRandomPromoCode = async (req, res) => {
  try {
    const randomPromoCode = await PromoCode.aggregate([
      { $sample: { size: 1 } }  // Get 1 random document
    ]);


    if (!randomPromoCode || randomPromoCode.length === 0) {
      return res.status(404).json({ message: "No promo codes available" });
    }
    return randomPromoCode[0];
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getTouristNotifications = async (req, res) => {
  try {
    const touristId = req.userId;
    const tourist = await touristModel.findById(touristId);
    const notifications = tourist.notificationList;
    return res.status(200).json(notifications);

  }
  catch (error) {

  }
}
// const checkTouristPromocode= async (req,res)
// {
//   const touristId = req.userId;
// }

module.exports = {
  createTourist,
  getTouristInfo,
  updateTouristProfile,
  changePassword,
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
  getRandomPromoCode,
  getTouristNotifications
  // checkTouristPromocode
};