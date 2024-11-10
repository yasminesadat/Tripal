import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FlightList.css'
import { useState, useEffect } from 'react';
import { getTouristAge } from '../../api/TouristService';
import { touristId } from '../../IDs';
import { getConversionRate } from '../../api/ExchangeRatesService';
import { message } from 'antd';
const FlightResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const flights = location.state?.flights || [];
  const originCityCode = location.state?.originLocationCode;
  const destCityCode = location.state?.destinationLocationCode;
  const [currency, setCurrency] = useState('EGP');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [touristAge, setTouristAge] = useState(null);

  useEffect(() => {
    const fetchCurrency = () => {
      const curr = sessionStorage.getItem('currency');
      console.log(sessionStorage)
      if (curr) {
        setCurrency(curr);
        fetchExchangeRate(curr);
      }
    };
    fetchCurrency();

    const fetchTouristAge = async () => {
      try {
        const data = await getTouristAge(touristId);
        setTouristAge(data.age);
      } catch (error) {
        message.error('Failed to fetch tourist age');
        console.error(error);
      }
    };

    fetchTouristAge();
  }, []);

  const fetchExchangeRate = async (curr) => {
    try {
      const rate = await getConversionRate(curr);
      setExchangeRate(rate);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    }
  };



  const handleBookNow = (flight) => {
    if (touristAge >= 18) {
      navigate('/tourist/booking-summary', { state: { flight, currency, exchangeRate,originCityCode,destCityCode } });
    } else {
      message.error('You must be at least 18 years old to book a flight.');
    }
  };

  const convertPrice = (price) => {
    return (price * exchangeRate).toFixed(2);
  };

  return (
    <div className="flight-results-container">
      <h1>Available Flights</h1>
      {flights.length > 0 ? (
        <ul className="flight-list">
          {flights.map((flight, index) => (
            <li key={index} className="flight-card">
              <h3 className="flight-price">
                {currency} {convertPrice(flight.price.total)}
              </h3>

              {flight.itineraries.map((itinerary, idx) => (
                <div key={idx} className="itinerary">
                  <h4>Flight {idx + 1}</h4>
                  {itinerary.segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex} className="segment">
                      <p><strong>Departure:</strong> {segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleString()}</p>
                      <p><strong>Arrival:</strong> {segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ))}

              <button className="book-button" onClick={() => handleBookNow(flight)}>Book Now</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No flights available.</p>
      )}
    </div>
  );
};

export default FlightResults;