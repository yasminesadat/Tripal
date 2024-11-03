import React, { useState } from 'react';
//import axios from 'axios';
import { getHotels } from '../api/HotelService';
function HotelFetcher() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);

  const fetchHotels = async () => {
    try {
      const response = await getHotels();
      setHotels(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={fetchHotels}>Get Hotels in Paris</button>
      {error && <p>Error: {error}</p>}
      <ul>
        {hotels.map((hotel, index) => (
          <li key={index}>{hotel.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default HotelFetcher;
