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
const { sendEmail } = require('./Mailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const Tourist = require("../models/users/Tourist");

cron.schedule('16 01 * * *', async () => {
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
  try {
    const result = await touristModel.updateMany(
      {},
      { $set: { promoCodes: [] } }
    );
    console.log(`Cleared promo codes for ${result.modifiedCount} users`);
  } catch (error) {
    console.error('Error clearing promo codes:', error.message);
  }
});



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
    const currTourist = Tourist.findById(id);
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
    console.log("email ", updateParameters.email);
    const existingEmail = await User.findOne({ email: updateParameters.email, _id: { $ne: req.userId } }); // same email but not her


    if (existingEmail) {
      console.log("exists alreadyy");
      return res.status(400).json({ error: "Email already exists" });
    }
    const existingEmailRequests = await Request.findOne({ email: updateParameters.email, status: { $ne: 'rejected' } });
    if (existingEmailRequests) {
      return res.status(400).json({ error: "Request has been submitted with this email" });
    }
    if (updateParameters.dateOfBirth) {
      res.status(400).json({
        status: "error",
        message:
          "You cannot update your date of birth, dont you know when you were born??",
      });
    }
    if (updateParameters.email && updateParameters.email !== currTourist.email) {
      await User.findOneAndUpdate(
        { email: currTourist.email },
        { email: updateParameters.email },
        { new: true, runValidators: true }
      );
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

const markTouristNotificationsRead = async (req, res) => {
  try {
    const userid=req.userId;

    const tourist = await touristModel.findById(userid);  
      if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }
     

    tourist.notificationList.forEach((n)=>{(n.read=true)})

    await tourist.save();    
    
    res.status(200).json(tourist.notificationList);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const checkTouristPromocode = async (req, res) => {
  const touristId = req.userId;
  const { promoCode } = req.body;

  try {
    const tourist = await touristModel
      .findById(touristId)
      .populate('promoCodes');

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Now promoCodes will be the full objects, not just IDs
    const isPromoCodeValid = tourist.promoCodes.some(promoCodeObj =>
      promoCodeObj.name === promoCode
    );
    console.log("valueee", isPromoCodeValid);
    console.log(tourist.promoCodes);
    console.log("promo", promoCode);
    if (!isPromoCodeValid) {
      return res.status(200).json({ status: "no", message: "Invalid promo code!" });
    }
    else {
      return res.status(200).json({ status: "yes", message: "Promo Code applied successfully!" });
    }
    // return res.status(200).json({ isPromoCodeValid });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const saveFlightBooking = async (req, res) => {
  try {
    const { bookedFlights, useWallet, paymentMethod } = req.body;
    const userId = req.userId;

    const existingTourist = await touristModel.findById(userId);
    if (!existingTourist) {
      return res.status(400).json({ error: "User ID doesn't exist!" });
    }


    if (paymentMethod === 'wallet') {
      existingTourist.wallet.amount = existingTourist.wallet.amount || 0;
      const totalCost = bookedFlights.reduce((total, flight) => total + parseFloat(flight.price), 0);
      let pointsToReceive = 0;

      if (existingTourist.totalPoints <= 100000) {
        pointsToReceive = totalCost * 0.5;
      } else if (existingTourist.totalPoints <= 500000) {
        pointsToReceive = totalCost * 1;
      } else {
        pointsToReceive = totalCost * 1.5;
      }

      if (useWallet) {
        if (existingTourist.wallet.amount < totalCost) {
          return res.status(400).json({ error: "Insufficient wallet balance." });
        }
        existingTourist.wallet.amount -= totalCost;
      }

      bookedFlights.forEach(flight => {
        const newFlightBooking = {
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          departureTime: new Date(flight.departureTime),
          arrivalTime: new Date(flight.arrivalTime),
          origin: flight.origin,
          destination: flight.destination,
          price: flight.price,
          currency: flight.currency || "EGP",
          bookingDate: new Date(),
        };

        existingTourist.bookedFlights.push(newFlightBooking);
      });

      existingTourist.totalPoints = existingTourist.totalPoints || 0;
      existingTourist.currentPoints = existingTourist.currentPoints || 0;
      existingTourist.totalPoints += pointsToReceive;
      existingTourist.currentPoints += pointsToReceive;
      await existingTourist.save();

      return res.status(200).json({
        message: "Flight booked successfully with wallet payment.",
        bookedFlights: existingTourist.bookedFlights,
      });
    }

    if (paymentMethod === 'card') {
      // Calculate the total cost of flights
      const totalAmount = bookedFlights.reduce((total, flight) => total + parseFloat(flight.price), 0);


      const lineItems = bookedFlights.map(flight => ({
        price_data: {
          currency: 'egp',
          product_data: {
            name: `Your Flight Number: ${flight.flightNumber}`,
          },
          unit_amount: Math.round(parseFloat(flight.price) * 100),  // Stripe requires amount in cents
        },
        quantity: 1,
      }));


      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: existingTourist.email,
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}&bookedFlights=${encodeURIComponent(JSON.stringify(bookedFlights))}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });

      return res.status(200).json({
        sessionId: session.id,
      });
    }

    return res.status(400).json({ error: 'Invalid payment method selected.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completeFlightBooking = async (req, res) => {
  const { sessionId, userId, bookedFlights } = req.body;

  try {
    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment was successful
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    // Find the tourist based on the userId
    const existingTourist = await touristModel.findById(userId);
    if (!existingTourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Process the booking for each flight
    bookedFlights.forEach(flight => {
      const newFlightBooking = {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        departureTime: new Date(flight.departureTime),
        arrivalTime: new Date(flight.arrivalTime),
        origin: flight.origin,
        destination: flight.destination,
        price: flight.price,
        currency: flight.currency || "EGP",
        bookingDate: new Date(),
      };

      // Add the flight booking to the tourist's bookedFlights array
      existingTourist.bookedFlights.push(newFlightBooking);
    });

    // Calculate the total price and update wallet if using wallet payment
    const totalCost = bookedFlights.reduce((total, flight) => total + parseFloat(flight.price), 0);
    if (req.body.paymentMethod === 'wallet') {
      if (existingTourist.wallet.amount < totalCost) {
        return res.status(400).json({ error: "Insufficient wallet balance" });
      }
      existingTourist.wallet.amount -= totalCost;
    }

    // Save the tourist's updated details
    await existingTourist.save();

    // Respond with success
    return res.status(200).json({
      message: "Flight booking completed successfully.",
      bookedFlights: existingTourist.bookedFlights,
    });

  } catch (error) {
    console.error("Error completing flight booking:", error);
    res.status(500).json({ error: error.message });
  }
};

const addToCart = asyncHandler(async (req, res) => {
  const { touristId, productId, quantity } = req.body;
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    const cartItem = tourist.cart.find((item) => item.product.toString() === productId);
    const price = product.price * quantity;

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.price += price;
    } else {
      tourist.cart.push({ product: productId, quantity, price });
    }
    await tourist.save();

    res.status(200).json({ message: "Product added to cart successfully.", cart: tourist.cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding product to cart.", error: error.message });
  }

});

const removeFromCart = asyncHandler(async (req, res) => {
  const { touristId, productId } = req.body;
  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    const cartIndex = tourist.cart.findIndex((item) => item.product.toString() === productId);
    if (cartIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart." });
    }

    tourist.cart.splice(cartIndex, 1);

    await tourist.save();

    res.status(200).json({ message: "Product removed from cart successfully.", cart: tourist.cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while removing product from cart.", error: error.message });
  }
});

const getCart = asyncHandler(async (req, res) => {
  const touristId = req.userId;

  try {
    const tourist = await touristModel.findById(touristId).populate('cart.product');

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    res.status(200).json({ cart: tourist.cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while retrieving the cart.", error: error.message });
  }
});


const getAddresses = asyncHandler(async (req, res) => {
  const touristId = req.userId;

  try {
    const tourist = await touristModel.findById(touristId);


    res.status(200).json({ addresses: tourist.deliveryAddresses });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while retrieving the addresses.", error: error.message });
  }
});
const getWalletAndTotalPoints = asyncHandler(async (req, res) => {
  const touristId = req.userId;

  try {
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const { wallet, totalPoints } = tourist;
    res.status(200).json({ wallet, totalPoints });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving wallet and total points.",

      error: error.message,
    });
  }
});


const addAddress = asyncHandler(async (req, res) => {
  const touristId = req.userId;
  const { street, city, zipCode, country } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    const addressExists = tourist.deliveryAddresses.some(
      (address) =>
        address.street === street &&
        address.city === city &&
        address.zipCode === zipCode &&
        address.country === country
    );

    if (addressExists) {
      return res.status(400).json({
        message: "Address already exists.",
      });
    }

    const newAddress = {
      street,
      city,
      zipCode,
      country,
    };

    tourist.deliveryAddresses.push(newAddress);

    await tourist.save();

    res.status(200).json({
      message: "Address added successfully.",
      address: newAddress,
    });

  } catch (error) {
    res.status(500).json({
      message: "An error occurred while adding the address."
    })
  }
});


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
  addToCart,
  removeFromCart,
  getCart,
  getRandomPromoCode,
  getTouristNotifications,
  checkTouristPromocode,
  saveFlightBooking,
  completeFlightBooking,
  getAddresses,
  addAddress,
  getWalletAndTotalPoints,
  markTouristNotificationsRead

};