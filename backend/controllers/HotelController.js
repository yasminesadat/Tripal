const Amadeus = require('amadeus');
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  });
  
// const amadeus=require('../App');
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
       bestRateOnly:true
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    
  };


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
  

module.exports={searchHotels,getHotelDetails,getHotelPrices,getCityCode};