const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: 'IuUmwsrhvB57Vp616ZGz7y340TcWXtjQ',
  clientSecret: 'E9ElYuHHFRSTgjNB',
});

const getFlights = async (req, res) => {
    // Extract parameters from the query string
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      max = 5, // Default to 5 if not provided
      nonStop = true // Default to true if not provided
    } = req.query; // Access query parameters
  
    // Validate required parameters
    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return res.status(400).json({ error: 'Missing required parameters: originLocationCode, destinationLocationCode, and departureDate are required.' });
    }
  
    try {
      // Call the Amadeus API with the extracted parameters
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode,
        destinationLocationCode,
        departureDate,
        returnDate,
        adults,
        max,
        nonStop,
      });
  
      // Return the response data
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).send(error.message);
    }
  };
  
  module.exports = { getFlights };