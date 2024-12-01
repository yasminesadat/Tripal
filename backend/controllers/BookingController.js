const Activity = require("../models/Activity");
const itineraryModel = require('../models/Itinerary');
const Tourist = require('../models/users/Tourist');
const { format } = require('date-fns'); 
const {sendEmail} = require('./Mailer');

const bookResource = async (req, res) => {
    const { resourceType, resourceId } = req.params;
    const { tickets} = req.body;
    const touristId = req.userId;
    const model = resourceType === 'activity' ? Activity : itineraryModel;
  
    try {
        const resource = await model.findById(resourceId);
        if (!resource) 
            return res.status(404).json({ error: `${resourceType} not found` });
        
        if (resourceType === 'activity' && resource.isBookingOpen === false) 
            return res.status(400).json({ error: 'Booking is closed for this activity' });
        
        const tourist = await Tourist.findById(touristId);
        if (!tourist) 
            return res.status(404).json({ error: 'Tourist not found' });
        
        if (tourist.calculateAge() < 18) 
            return res.status(403).json({ error: 'You must be at least 18 years old to book' });
    
        if (resourceType === 'itinerary') {
                 
            const existingBooking = resource.bookings.find(booking => booking.touristId.toString() === touristId);
            if (existingBooking) {
                existingBooking.tickets += tickets;
            } else {
                resource.bookings.push({ touristId, tickets});
            }

            tourist.wallet.amount -= resource.price*tickets+resource.serviceFee;

            
        } 
        else{
            const existingBooking = resource.bookings.find(booking => booking.touristId.toString() ===touristId );
            if (existingBooking) 
                existingBooking.tickets += tickets;
            
            else 
                resource.bookings.push({ touristId,tickets});
            
            tourist.wallet.amount -= resource.price*tickets;
        }
        if(tourist.wallet.amount<0)
            return res.status(400).json({ error: 'Insufficient money in wallet, Why are you so poor?' });
        
        await tourist.save();
        await resource.save();

        let pointsToReceive=0;

        if(tourist.totalPoints<=100000){
            pointsToReceive=resource.price*0.5*tickets;
        }else if(tourist.totalPoints<=500000){
            pointsToReceive=resource.price*1*tickets;
        } else {
            pointsToReceive=resource.price*1.5*tickets;
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

            const subject = `Booking Confirmation for ${resource.title}`;
            const html = `
              <h1>Booking Successful!</h1>
              <p>Dear ${tourist.userName},</p>
              <p>Your booking for ${resource.title} has been confirmed.</p>
              <p>Tickets Booked: ${tickets}</p>
              <p>Total Cost: ${resource.price * tickets}</p>
              <p>Wallet Balance: ${tourist.wallet.amount}</p>
              <p>Points Earned: ${pointsToReceive}</p>
              <p>Thank you for booking with us!</p>
            `;
            try {
              await sendEmail("daiana.rehan.dr@gmail.com", subject, html);
              res.status(200).json({ message: `Congratulations, ${resourceType} booked successfully, Booking confirmation email sent` });
            } catch (error) {
              console.error('Error sending booking confirmation:', error.message);
            }
          
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
  };

const cancelResource = async (req, res) => {
const { resourceType, resourceId } = req.params;
const touristId  = req.userId;
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
                        
    
            if (tourist){
                tourist.wallet.amount += resource.price*resource.bookings[bookingIndex].tickets;
                ticketsForPoints=resource.bookings[bookingIndex].tickets;
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

        if (tourist){
            tourist.wallet.amount += resource.price*resource.bookings[bookingIndex].tickets+resource.serviceFee;
            ticketsForPoints=resource.bookings[bookingIndex].tickets;   
            await tourist.save();
        } 
        resource.bookings.splice(bookingIndex, 1);   
        resource.markModified('bookings');
    }
    await resource.save();

        if (!tourist) 
            return res.status(404).json({ error: 'Tourist not found' });

    let pointsToDecrement=0;
    if(tourist.totalPoints<=100000){
        pointsToDecrement=resource.price*0.5*ticketsForPoints;

    }else if(tourist.totalPoints<=500000){
        pointsToDecrement=resource.price*ticketsForPoints;

    } else {
        pointsToDecrement=resource.price*1.5*ticketsForPoints;
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

    res.status(200).json({ message: `${resourceType} booking canceled successfully, kindly check your balance.` });
} catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error });
}
};

module.exports = {cancelResource, bookResource};