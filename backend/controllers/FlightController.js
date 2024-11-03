const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: 'IuUmwsrhvB57Vp616ZGz7y340TcWXtjQ',
  clientSecret: 'E9ElYuHHFRSTgjNB',
});

const getFlights = async (req, res) => {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: 'SYD',
      destinationLocationCode: 'BKK',
      departureDate: '2024-11-10',
      returnDate: '2024-11-23',
      adults: 2,
      max: 5,
      nonStop: true,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { getFlights };
