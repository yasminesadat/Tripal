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

module.exports={searchHotels};