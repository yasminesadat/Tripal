const Amadeus = require('amadeus');
const hotelBookings = require('../models/BookingHotel');
const Tourist = require('../models/users/Tourist.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  });
  

  const getCityCode= async(req,res)=>{
    const searchinfo=req.query.searchinfo;
    try{
      const response = await amadeus.referenceData.locations.cities.get({
        keyword: searchinfo,
        max:12
      });
      res.json(response.data);
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const searchHotels= async (req, res) => {
  const cityCode = req.query.cityCode;
    try {
      const response = await amadeus.referenceData.locations.hotels.byCity.get({
        cityCode, // You can replace 'PAR' or make it dynamic based on user input
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }; 


  const getHotelDetails= async(req,res)=>{
    const hotelIds= req.query.hotelID;
    try {
      const response = await amadeus.eReputation.hotelSentiments.get({
        hotelIds,
      });
       
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }; 

  const getHotelPrices= async(req,res)=>{
    const {hotelIds,checkInDate,checkOutDate,adults,boardType}=req.query;
    try{
      const response = await amadeus.shopping.hotelOffersSearch.get({
        hotelIds:hotelIds,
        adults,
        checkInDate,
        checkOutDate,
        boardType,
       bestRateOnly:true,
       currency:'EGP'
      });
      res.json(response.result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

  const saveBooking = async (req, res) => {
    const { hotelid, hotelname, cityCode, singleNumber, doubleNumber, tripleNumber, checkIn, checkOut, pricing, singlePricing, doublePricing, triplePricing, status, paymentMethod } = req.body;
    console.log("REQUEST", req.body);
    const userId = req.userId;
  
    try {
      const existingTourist = await Tourist.findById(userId);
      if (!existingTourist) {
        return res.status(400).json({ error: "UserID doesn't exist!" });
      }
      console.log('Received payment method:', paymentMethod);
  
  
      if (paymentMethod === 'wallet') {
        existingTourist.wallet.amount = existingTourist.wallet.amount || 0;
  
        let pointsToReceive = 0;
        const totalCost = pricing;
  
        if (existingTourist.totalPoints <= 100000) {
          pointsToReceive = totalCost * 0.5;
        } else if (existingTourist.totalPoints <= 500000) {
          pointsToReceive = totalCost * 1;
        } else {
          pointsToReceive = totalCost * 1.5;
        }
  
        if (existingTourist.wallet.amount < totalCost) {
          return res.status(400).json({ error: "Insufficient wallet balance." });
        }
  
        existingTourist.wallet.amount -= (totalCost);
        await existingTourist.save();
  
        const newBooking = await hotelBookings.create({
          user: userId, hotelid, hotelname, cityCode, singleRoom: singleNumber, doubleRoom: doubleNumber, tripleRoom: tripleNumber, checkIn, checkOut, pricing, status, paymentMethod
        });
  
        existingTourist.bookedHotels.push(newBooking._id);
        existingTourist.totalPoints = existingTourist.totalPoints || 0;
        existingTourist.currentPoints = existingTourist.currentPoints || 0;
        existingTourist.totalPoints += pointsToReceive;
        existingTourist.currentPoints += pointsToReceive;
        await existingTourist.save();
  
        res.status(201).json(newBooking);
      } else if (paymentMethod === 'card') {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          customer_email: existingTourist.email,
          line_items: [
            {
              price_data: {
                currency: 'egp',
                product_data: {
                  name: `${hotelname} - ${cityCode}`,
                  description: `Hotel ID: ${hotelid} | ${checkIn} - ${checkOut}`,
                },
                unit_amount: pricing * 100, // Convert to smallest currency unit (e.g., EGP cents)
              },
              quantity: 1,
            },
          ],
          metadata: {
            userid: userId,
          },
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/successHotel?session_id={CHECKOUT_SESSION_ID}&hotelid=${encodeURIComponent(hotelid)}&hotelname=${encodeURIComponent(hotelname)}&cityCode=${encodeURIComponent(cityCode)}&singleNumber=${singleNumber}&singlePrice=${req.body.singlePrice}&doubleNumber=${doubleNumber}&doublePrice=${req.body.doublePrice}&tripleNumber=${tripleNumber}&triplePrice=${req.body.triplePrice}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&pricing=${pricing}&paymentMethod=${paymentMethod}`,
          cancel_url: `${process.env.FRONTEND_URL}/hotel2`,
        });
        //console.log("Stripe session created:", session);
  
        const newBooking = await hotelBookings.create({
          user: userId,
          hotelid,
          hotelname,
          cityCode,
          singleRoom: singleNumber,
          doubleRoom: doubleNumber,
          tripleRoom: tripleNumber,
          checkIn,
          checkOut,
          pricing,
          status: "confirmed",
          paymentMethod
        });
        existingTourist.bookedHotels.push(newBooking._id);
        await existingTourist.save();
  
        res.status(201).json({ sessionId: session.id });
      } else {
        res.status(400).json({ error: 'Invalid payment method' });
      }
    } catch (error) {
      console.error('Error saving booking:', error.message);
      console.error('Error stack:', error.stack);
  
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
  
      res.status(500).json({ error: error.message });
    }
  
  };


module.exports={searchHotels,getHotelDetails,getHotelPrices,getCityCode,saveBooking};