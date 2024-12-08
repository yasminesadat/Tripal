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

cron.schedule('43 00 * * *', async () => {
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
    } catch (error) {
      continue;
    }
  }
});

cron.schedule('59 23 * * *', async () => {
  try {
    await touristModel.updateMany(
      {},
      { $set: { promoCodes: [] } }
    );
  } catch (error) {
  }
});

const createTourist = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { userName, email, password, mobileNumber, nationality, dateOfBirth, job, tags = [], categories = [] } = req.body;

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ error: "Username already exists" });
    }

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
    const existingEmailRequests = await Request.findOne({
      email,
      status: { $ne: 'rejected' }
    });
    if (existingEmailRequests) {
      return res.status(400).json({ error: "Request has been submitted with this email" });
    }
    if (!userName || !email || !password || !mobileNumber || !nationality || !dateOfBirth || !job) {
      return res.status(400).json({ error: "Please add all fields" });
    }
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tourist ID",
      });
    }

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
    const currTourist = await Tourist.findById(id);

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

    if (updateParameters.email && updateParameters.email !== currTourist.email) {
      const existingEmail = await User.findOne({ email: updateParameters.email, _id: { $ne: req.userId } }); // same email but not her
      if (existingEmail && updateParameters.email !== currTourist.email) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const existingEmailRequests = await Request.findOne({ email: updateParameters.email, status: { $ne: 'rejected' } });
      if (existingEmailRequests) {
        return res.status(400).json({ error: "Request has been submitted with this email" });
      }

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
  const { eventId, eventType } = req.body;

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

    const bookmarkArray = eventType === 'activity' ? 'bookmarkedActivities' : 'bookmarkedItineraries';
    if (!tourist[bookmarkArray].includes(eventId)) { 
      tourist[bookmarkArray].push(eventId);
      await tourist.save();
    }                           
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
  const touristId = req.userId;
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
        type: "activity"                   
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
    res.status(500).json({ error: "Server error" });
  }
};

const removeFromWishList = async (req, res) => {
  const touristId = req.userId;
  const { productId } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);

    tourist.wishlist = tourist.wishlist.filter(id => id.toString() !== productId.toString());
    await tourist.save();

    res.status(200).json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getRandomPromoCode = async (req, res) => {
  try {
    const randomPromoCode = await PromoCode.aggregate([
      { $sample: { size: 1 } } 
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
    const userid = req.userId;

    const tourist = await touristModel.findById(userid);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    tourist.notificationList.forEach((n) => { (n.read = true) })

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

    const isPromoCodeValid = tourist.promoCodes.some(promoCodeObj =>
      promoCodeObj.name === promoCode
    );

    const promoCodeObject = await PromoCode.find({ name: promoCode });
    if (!isPromoCodeValid) {
      return res.status(200).json({ status: "no", message: "Invalid promo code!" });
    }
    else {
      return res.status(200).json({ status: "yes", message: "Promo Code applied successfully!", promo: promoCodeObject });
    }
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
      const totalAmount = bookedFlights.reduce((total, flight) => total + parseFloat(flight.price), 0);

      const lineItems = bookedFlights.map(flight => ({
        price_data: {
          currency: 'egp',
          product_data: {
            name: `Your Flight Number: ${flight.flightNumber}`,
          },
          unit_amount: Math.round(parseFloat(flight.price) * 100),  
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
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    const existingTourist = await touristModel.findById(userId);
    if (!existingTourist) {
      return res.status(404).json({ error: "Tourist not found" });
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

    const totalCost = bookedFlights.reduce((total, flight) => total + parseFloat(flight.price), 0);
    if (req.body.paymentMethod === 'wallet') {
      if (existingTourist.wallet.amount < totalCost) {
        return res.status(400).json({ error: "Insufficient wallet balance" });
      }
      existingTourist.wallet.amount -= totalCost;
    }

    await existingTourist.save();

    return res.status(200).json({
      message: "Flight booking completed successfully.",
      bookedFlights: existingTourist.bookedFlights,
    });

  } catch (error) {
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

const updateQuantity = asyncHandler(async (req, res) => {
  const touristId = req.userId;
  const { productId, quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity provided." });
  }

  try {
    const tourist = await touristModel
      .findById(touristId)
      .populate("cart.product");

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    const cartIndex = tourist.cart.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (cartIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart." });
    }

    tourist.cart[cartIndex].quantity = quantity;
    tourist.cart[cartIndex].price =
      quantity * tourist.cart[cartIndex].product.price;

    await tourist.save();

    res.status(200).json({
      message: "Product's quantity in cart updated successfully.",
      cart: tourist.cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating product's quantity in cart.",
      error: error.message,
    });
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
  markTouristNotificationsRead,
  updateQuantity
};