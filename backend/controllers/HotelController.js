const Amadeus = require('amadeus');
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  });
  
const searchHotels= async (req, res) => {
    try {
      const response = await amadeus.referenceData.locations.hotels.byCity.get({
        cityCode: 'PAR', // You can replace 'PAR' or make it dynamic based on user input
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }; 

module.exports={searchHotels};