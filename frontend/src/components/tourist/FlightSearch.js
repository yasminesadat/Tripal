import React, { useEffect, useState } from 'react';

const FlightSearch = () => {
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch('http://localhost:5050/api/flightSearch');
        if (!response.ok) {
          throw new Error('Error fetching flights');
        }
        const data = await response.json();
        setFlights(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFlights();
  }, []);

  return (
    <div>
      <h1>Flight Search Results</h1>
      {error && <p>{error}</p>}
      <ul>
        {flights.map((flight, index) => (
          <li key={index}>
            <p>Total Price: {flight.price.currency} {flight.price.total}</p>
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSearch;
