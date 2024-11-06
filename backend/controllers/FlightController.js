const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: 'IuUmwsrhvB57Vp616ZGz7y340TcWXtjQ',
  clientSecret: 'E9ElYuHHFRSTgjNB',
});

const getFlights = async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    max = 5,
    nonStop = true,
    cabin 
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
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).send(error.message);
  }
};

module.exports = { getFlights };
