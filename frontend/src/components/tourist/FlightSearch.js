import React from 'react';
import { useLocation } from 'react-router-dom';

const FlightResults = () => {
  const location = useLocation();
  const flights = location.state?.flights || []; // Get the flights from the passed state

  const handleBookNow = (flight) => {
    // Logic for booking the flight goes here
    alert(`Booking flight with price: ${flight.price.total} ${flight.price.currency}`);
  };

  return (
    <div>
      <h1>Available Flights</h1>
      <ul>
        {flights.length > 0 ? flights.map((flight, index) => (
          <li key={index}>
            <h3>Total Price: {flight.price.currency} {flight.price.total}</h3>
            {flight.itineraries.map((itinerary, idx) => (
              <div key={idx}>
                {itinerary.segments.map((segment, segmentIndex) => (
                  <div key={segmentIndex}>
                    <p>Departure: {segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleString()}</p>
                    <p>Arrival: {segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ))}
            <button onClick={() => handleBookNow(flight)}>Book Now</button>
          </li>
        )) : <p>No flights available.</p>}
      </ul>
    </div>
  );
};

export default FlightResults;
