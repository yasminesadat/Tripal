const Activity = require("../models/Activity");
const itineraryModel = require('../models/Itinerary');
const Tourist = require('../models/users/Tourist');
const { sendEmail } = require('./Mailer');
const cron = require('node-cron');
const moment = require('moment'); // Use moment.js for date manipulation
const promoCode = require('../models/PromoCode');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const bookResource = async (req, res) => {
  const { resourceType, resourceId } = req.params;
  const { tickets, paymentMethod, myPromoCode } = req.body;
  const touristId = req.userId;
  const model = resourceType === 'activity' ? Activity : itineraryModel;

  try {
    const resource = await model.findById(resourceId);
    if (!resource) return res.status(404).json({ error: `${resourceType} not found` });

    if (resourceType === 'activity' && !resource.isBookingOpen)
      return res.status(400).json({ error: 'Booking is closed for this activity' });

    const tourist = await Tourist.findById(touristId);
    if (!tourist) return res.status(404).json({ error: 'Tourist not found' });
    if (tourist.calculateAge() < 18)
      return res.status(403).json({ error: 'You must be at least 18 years old to book' });

    let totalAmount = resource.price * tickets + (resource.serviceFee ? resource.serviceFee : 0);

    if (myPromoCode) {
      const code = await promoCode.findOne({ name: myPromoCode });
      if (code) {
        const discountValue = code.discountPercentage / 100 * totalAmount;
        totalAmount -= discountValue;
      } else {
        return res.status(400).json({ error: 'Invalid promo code' });
      }
    }

    if (paymentMethod === 'card') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: tourist.email,
        line_items: [
          {
            price_data: {
              currency: 'egp',
              product_data: {
                name: `${resourceType} Booking: ${resource.title}`,
                description: `Booking Description: ${resource.description}`,
              },
              unit_amount: Math.round((totalAmount * 100) / tickets), // Stripe expects amount in the smallest unit (cents)
            },
            quantity: tickets,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success/resource?session_id={CHECKOUT_SESSION_ID}&tourist_id=${touristId}&resource_type=${resourceType}&tickets=${tickets}&resource_id=${resourceId}`,
        cancel_url: `${process.env.FRONTEND_URL}/upcoming-activities`,
      });
      return res.status(200).json({ sessionId: session.id });
    }

    if (paymentMethod === 'wallet') {
      if (tourist.wallet.amount < totalAmount) {
        return res.status(400).json({ error: 'Insufficient funds in wallet' });
      }

      tourist.wallet.amount -= totalAmount;

      const existingBooking = resource.bookings.find(
        (booking) => booking.touristId.toString() === touristId
      );
      if (existingBooking) {
        existingBooking.tickets += tickets;
      } else {
        resource.bookings.push({ touristId, tickets });
      }

      await tourist.save();
      await resource.save();

      let pointsToReceive = 0;
      if (tourist.totalPoints <= 100000) {
        pointsToReceive = resource.price * 0.5 * tickets;
      } else if (tourist.totalPoints <= 500000) {
        pointsToReceive = resource.price * 1 * tickets;
      } else {
        pointsToReceive = resource.price * 1.5 * tickets;
      }

      await Tourist.findByIdAndUpdate(
        touristId,
        {
          $inc: {
            totalPoints: pointsToReceive,
            currentPoints: pointsToReceive,
          },
        },
        { new: true }
      );

      // Send booking confirmation email
      const subject = `Booking Confirmation for ${resource.title}`;
      const html = `
        <h1>Booking Successful!</h1>
        <p>Dear ${tourist.userName},</p>
        <p>Your booking for ${resource.title} has been confirmed.</p>
        <p>Tickets Booked: ${tickets}</p>
        <p>Total Cost: ${totalAmount}</p>
        <p>Wallet Balance: ${tourist.wallet.amount}</p>
             <p> Payment Method: Wallet</p>
        <p>Points Earned: ${pointsToReceive}</p>
        <p>Thank you for booking with us!</p>
      `;
      try {
        await sendEmail(tourist.email, subject, html);
        res.status(200).json({
          message: `Congratulations, ${resourceType} booked successfully.`,
          totalAmount: totalAmount,
          paymentStatus: 'Wallet payment successful',
        });
      } catch (error) {
        console.error('Error sending booking confirmation:', error.message);
      }
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const cancelResource = async (req, res) => {
  const { resourceType, resourceId } = req.params;
  const touristId = req.userId;
  var refundedAmount = 0.0;
  const model = resourceType === 'activity' ? Activity : itineraryModel;
  const currentTime = new Date();

  var ticketsForPoints;

  try {
    const resource = await model.findById(resourceId);
    const tourist = await Tourist.findById(touristId);

    if (!resource)
      return res.status(404).json({ error: `${resourceType} not founddd` });

    let cancellationDeadline;
    if (resourceType === 'activity') {
      cancellationDeadline = new Date(resource.date);
    } else if (resourceType === 'itinerary') {
      cancellationDeadline = new Date(resource.startDate);
    }
    cancellationDeadline.setHours(0, 0, 0, 0);
    currentTime.setHours(0, 0, 0, 0);

    const msIn48Hours = 48 * 60 * 60 * 1000;
    if (cancellationDeadline - currentTime <= msIn48Hours && cancellationDeadline > currentTime) {
      return res.status(400).json({ error: "You cant cancel bookings 48 hours before the event." });
    }

    if (resourceType === 'activity') {
      const bookingIndex = resource.bookings.findIndex(
        booking => booking.touristId.toString() === touristId
      );

      if (bookingIndex === -1)
        return res.status(400).json({ error: `You have no booking for this ${resourceType}` });


      if (tourist) {
        tourist.wallet.amount += resource.price * resource.bookings[bookingIndex].tickets;
        ticketsForPoints = resource.bookings[bookingIndex].tickets;
        refundedAmount = resource.price * resource.bookings[bookingIndex].tickets;;
        await tourist.save();
      }
      resource.bookings.splice(bookingIndex, 1);
      resource.markModified('bookings');
    }
    else if (resourceType === 'itinerary') {

      const bookingIndex = resource.bookings.findIndex(
        booking => booking.touristId.toString() === touristId
      );
      if (bookingIndex === -1) {
        return res.status(400).json({ error: `You have no booking for this ${resourceType}` });
      }

      if (tourist) {
        tourist.wallet.amount += resource.price * resource.bookings[bookingIndex].tickets + resource.serviceFee;
        ticketsForPoints = resource.bookings[bookingIndex].tickets;
        refundedAmount = resource.price * resource.bookings[bookingIndex].tickets + resource.serviceFee;
        await tourist.save();
      }
      resource.bookings.splice(bookingIndex, 1);
      resource.markModified('bookings');
    }
    await resource.save();

    if (!tourist)
      return res.status(404).json({ error: 'Tourist not found' });

    let pointsToDecrement = 0;
    if (tourist.totalPoints <= 100000) {
      pointsToDecrement = resource.price * 0.5 * ticketsForPoints;

    } else if (tourist.totalPoints <= 500000) {
      pointsToDecrement = resource.price * ticketsForPoints;

    } else {
      pointsToDecrement = resource.price * 1.5 * ticketsForPoints;
    }

    await Tourist.findByIdAndUpdate(
      touristId,
      {
        $inc: {
          totalPoints: -pointsToDecrement,
          currentPoints: -pointsToDecrement,
        },
      },
      { new: true }
    );

    res.status(200).json({ message: `${resourceType} booking canceled successfully, kindly check your balance.`, refunded: refundedAmount });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error });
  }
};


// * * * * * 
// | | | | |
// | | | | +---- Day of the week (0 - 7) (Sunday = 0 or 7)
// | | | +------ Month (1 - 12)
// | | +-------- Day of the month (1 - 31)
// | +---------- Hour (0 - 23)
// +------------ Minute (0 - 59)

//'1 * * * *' --> 1 min from now
//'30 14 * * *' --> at 2 30 PM
//'0 0 * * *' --> at midnight
//LAW ANA YOOM 1 EL EMAIL HAYETBE3ET LAW EL EVENT YOOM 4

// Cron job to run every day at midnight
cron.schedule('6 22 * * *', async () => {
  const today = moment().utc();  // Current date and time in UTC
  const fiveDaysLater = today.add(3, 'days').startOf('day').utc(); // Start of the day in UTC
  const endOfDay = fiveDaysLater.clone().endOf('day'); // End of the day in UTC

  console.log('Today:', today.toString());
  console.log('Five days later (start of day, UTC):', fiveDaysLater.toString());
  console.log('End of day (UTC):', endOfDay.toString());

  try {
    // Find activities that are exactly 3 days away, ensuring the activity date falls between midnight and 11:59:59.999
    const activities = await Activity.find({
      date: { $gte: fiveDaysLater.toDate(), $lt: endOfDay.toDate() }, // Date range: start of the day to the end of the day (UTC)
      isBookingOpen: true,
    });
    //console.log('Found activities:', activities); 
    if (activities.length > 0) {
      for (let activity of activities) {
        // Iterate over the tourists who booked the activity
        for (let booking of activity.bookings) {
          const tourist = await Tourist.findById(booking.touristId);
          if (tourist && tourist.email) {
            const subject = `Your upcoming activity: ${activity.title}`;
            const html = `
                <p>Dear ${tourist.userName},</p>
                <p>This is a reminder that your booked activity, <strong>${activity.title}</strong>, is coming up in 3 days!</p>
                <p>Location: ${activity.location}</p>
                <p>Date: ${moment(activity.date).format('MMMM Do YYYY')}</p>
                <p>We hope you're excited! If you have any questions, feel free to contact us.</p>
                <p>Best regards,</p>
                <p>Tripal Team</p>
              `;

            await sendEmail(tourist.email, subject, html);
            console.log("SENT!")
            tourist.notificationList.push({

              message: `This is a reminder that your booked activity, ${activity.title}, is coming up in 3 days!`,
              notifType: "events"
            });
            await tourist.save();

          }
        }
      }
    } else {
      console.log('No activities found for 5 days.');
    }
  } catch (error) {
    console.error('Error checking activities for 5 days later:', error);
  }
});

cron.schedule('41 17 * * *', async () => {
  const today = moment().utc();  // Current date and time in UTC
  const fiveDaysLater = today.add(3, 'days').startOf('day').utc(); // Start of the day in UTC
  const endOfDay = fiveDaysLater.clone().endOf('day'); // End of the day in UTC

  console.log('Today:', today.toString());
  console.log('Five days later (start of day, UTC):', fiveDaysLater.toString());
  console.log('End of day (UTC):', endOfDay.toString());

  try {
    // Find itineraries that start in exactly 3 days, ensuring the itinerary start date falls between midnight and 11:59:59.999 UTC
    const itineraries = await itineraryModel.find({
      startDate: { $gte: fiveDaysLater.toDate(), $lt: endOfDay.toDate() }, // Date range: start of the day to the end of the day (UTC)
      isActive: true,  // Only consider active itineraries
    });

    //console.log('Found itineraries:', itineraries); 

    if (itineraries.length > 0) {
      for (let itinerary of itineraries) {
        console.log('Itinerary Start Date:', moment(itinerary.startDate).toString());

        // Iterate over the tourists who booked the itinerary
        for (let booking of itinerary.bookings) {
          const tourist = await Tourist.findById(booking.touristId);
          if (tourist && tourist.email) {
            const subject = `Your upcoming itinerary: ${itinerary.title}`;
            const html = `
              <p>Dear ${tourist.userName},</p>
              <p>This is a reminder that your booked itinerary, <strong>${itinerary.title}</strong>, is coming up in 5 days!</p>
              <p>Location: ${itinerary.pickupLocation}</p>
              <p>Start Date: ${moment(itinerary.startDate).format('MMMM Do YYYY')}</p>
              <p>We hope you're excited! If you have any questions, feel free to contact us.</p>
              <p>Best regards,</p>
              <p>Tripal Team</p>
            `;

            await sendEmail(tourist.email, subject, html);
            console.log("SENT!");
          }
        }
      }
    } else {
      console.log('No itineraries found for 5 days.');
    }
  } catch (error) {
    console.error('Error checking itineraries for 5 days later:', error);
  }
});

const completeBooking = async (req, res) => {
  const { sessionId, touristId, resourceType, tickets, resourceId } = req.body;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log("im here in complete booking");

  if (session.payment_status !== "paid") {
    return res.status(400).json({ error: "Payment not successful" });
  }

  try {
    const model = resourceType === 'activity' ? Activity : itineraryModel;
    const resource = await model.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ error: `${resourceType} not found` });
    }

    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const existingBooking = resource.bookings.find(
      (booking) => booking.touristId.toString() === touristId
    );
    if (existingBooking) {
      existingBooking.tickets += tickets; // Update tickets if the booking exists
    } else {
      resource.bookings.push({ touristId, tickets });
    }

    await resource.save();
    await tourist.save();

    // Send booking confirmation email
    const subject = `Booking Confirmation for ${resource.title}`;
    const html = `
      <h1>Booking Successful!</h1>
      <p>Dear ${tourist.userName},</p>
      <p>Your booking for ${resource.title} has been confirmed.</p>
      <p>Tickets Booked: ${tickets}</p>
      <p>Total Cost: ${resource.price * tickets + (resource.serviceFee ? resource.serviceFee : 0)}</p>
      <p>Wallet Balance: ${tourist.wallet.amount}</p>
      <p>Payment Method: Credit Card</p>
    <p>Thank you for booking with us!</p>

    `;

    try {
      await sendEmail(tourist.email, subject, html);
      res.status(200).json({
        message: "Booking completed successfully, confirmation email sent",
      });
    } catch (error) {
      console.error('Error sending booking confirmation:', error.message);
      res.status(500).json({ error: 'Error sending booking confirmation email' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { cancelResource, bookResource, completeBooking };