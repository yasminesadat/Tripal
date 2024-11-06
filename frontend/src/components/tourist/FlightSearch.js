import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FlightList.css'
const FlightResults = () => {
  const navigate= useNavigate();
  const location = useLocation();
  const flights = location.state?.flights || [];
  //const touristId = "= import 
  const handleBookNow = (flight) => {
    navigate('/tourist/booking-summary', { state: { flight } });
  };
  

  return (
    <div className="flight-results-container">
      <h1>Available Flights</h1>
      {flights.length > 0 ? (
        <ul className="flight-list">
          {flights.map((flight, index) => (
            <li key={index} className="flight-card">
              <h3 className="flight-price">{flight.price.currency} {flight.price.total}</h3>
              
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