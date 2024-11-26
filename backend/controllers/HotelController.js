const Amadeus = require('amadeus');
const hotelBookings = require('../models/BookingHotel');
const Tourist = require('../models/users/Tourist.js');
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

  const saveBooking= async (req,res)=>{
      try {
        const {hotelid,hotelname,cityCode,singleNumber,doubleNumber, tripleNumber,checkIn,checkOut,pricing,status } = req.body;
        const userid=req.userId;
        const existingTourist = await Tourist.findById(userid);
        if (!existingTourist) {
          return res.status(400).json({ error: "UserID doesn't exist!" });
        }
        console.log("hi2")

        const newBooking = await hotelBookings.create({
          user:userid,hotelid,hotelname,cityCode,singleRoom:singleNumber,doubleRoom:doubleNumber,tripleRoom:tripleNumber,checkIn,checkOut,pricing,status
        });

       existingTourist.bookedHotels.push(newBooking._id);
       await existingTourist.save();

        res.status(201).json(newBooking);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    };
  



  

module.exports={searchHotels,getHotelDetails,getHotelPrices,getCityCode,saveBooking};