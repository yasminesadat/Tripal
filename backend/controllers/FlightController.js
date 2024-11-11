const Amadeus = require('amadeus');

require('dotenv').config();

const amadeus = new Amadeus({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret
});

const getFlights = async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    max = 150,
    nonStop = true,
    cabin, 
    currencyCode = 'EGP'
  } = req.query;

  if (!originLocationCode || !destinationLocationCode || !departureDate) {
    return res.status(400).json({ error: 'Missing required parameters: originLocationCode, destinationLocationCode, and departureDate are required.' });
  }

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      max,
      nonStop,
      travelClass: cabin, 
      currencyCode
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).send(error.message);
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

module.exports = { getFlights, getCityCode };
