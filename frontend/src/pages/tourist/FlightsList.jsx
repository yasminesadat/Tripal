import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTouristAge } from '../../api/TouristService';
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
      if (curr) {
        setCurrency(curr);
        fetchExchangeRate(curr);
      }
    };
    fetchCurrency();

    const fetchTouristAge = async () => {
      try {
        const data = await getTouristAge();
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
      navigate('/tourist/booking-summary', { state: { flight, currency, exchangeRate, originCityCode, destCityCode } });
    } else {
      message.error('You must be at least 18 years old to book a flight.');
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const convertPrice = (price) => {
    return (price * exchangeRate).toFixed(2);
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background: #f5f5f5;
        }

        .container {
          max-width: 85%; /* Reduced max width for smaller layout */
          margin: auto;
          padding: 1.5rem;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem; /* Added gap for spacing between cards */
        }

        .col-12 {
          width: 100%;
        }

        .tourCard {
          border: 0.1rem solid #ddd;
          border-radius: 0.75rem;
          padding: 1rem; /* Reduced padding */
          box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1); /* Subtle shadow */
          background: white;
          margin-bottom: 1rem;
          max-width: 80rem; /* Restricts card width */
        }

        .tourCard__content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .tourCard__title {
          font-size: 1.5rem; /* Smaller font size */
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .flight-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem; /* Reduced spacing between elements */
          padding: 0.5rem 0;
        }

        .station-info {
          text-align: center;
          flex: 1;
        }

        .station-code {
          font-size: 1.8rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .station-time {
          font-size: 1.2rem;
          color: #4a5568;
        }

        .station-date {
          font-size: 1rem;
          color: #718096;
        }

        .flight-path {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 0 1rem;
        }

        .flight-path-line {
          height: 0.1rem;
          background: #e2e8f0;
          width: 100%;
          position: absolute;
        }

        .layover-info {
          margin: 0.75rem 0;
          font-size: 1rem;
          color: #718096;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .layover-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: #ed8936;
          border-radius: 50%;
        }

        .tourCard__info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 0.1rem solid #e2e8f0;
        }

        .tourCard__price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          font-size: 1.5rem;
          color: #2d3748;
        }

        .button {
          padding: 0.75rem 1.5rem;
          border: 0.2rem solid #5a9ea0;
          border-radius: 0.5rem;
          background: #5a9ea0;
          cursor: pointer;
          color: white;
          transition: 0.3s;
          font-size: 1rem;
          font-weight: 600;
        }

        .button:hover {
          background: #11302a;
          color: white;
          transform: translateY(-0.1rem);
        }
      `}</style>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#2d3748' }}>
                {flights.length} flight(s) found
              </h2>

              <div className="flights-list">
                {flights.length > 0 ? (
                  flights.map((flight, index) => (
                    <div className="col-12" key={index}>
                      <div className="tourCard">
                        <div className="tourCard__content">
                          <h3 className="tourCard__title">
                            Flight {index + 1}
                          </h3>

                          {flight.itineraries.map((itinerary, i) => (
                            <div key={i}>
                              {itinerary.segments.map((segment, segmentIndex) => (
                                <div key={segmentIndex}>
                                  <div className="flight-details">
                                    {/* Departure */}
                                    <div className="station-info">
                                      <div className="station-code">
                                        {segment.departure.iataCode}
                                      </div>
                                      <div className="station-time">
                                        {formatTime(segment.departure.at)}
                                      </div>
                                      <div className="station-date">
                                        {formatDate(segment.departure.at)}
                                      </div>
                                    </div>

                                    {/* Flight path */}
                                    <div className="flight-path">
                                      <div className="flight-path-line" />
                                      <Plane className="text-blue-500 rotate-90 transform -translate-y-1" size={32} />
                                    </div>

                                    {/* Arrival */}
                                    <div className="station-info">
                                      <div className="station-code">
                                        {segment.arrival.iataCode}
                                      </div>
                                      <div className="station-time">
                                        {formatTime(segment.arrival.at)}
                                      </div>
                                      <div className="station-date">
                                        {formatDate(segment.arrival.at)}
                                      </div>
                                    </div>
                                  </div>

                                  {segmentIndex < itinerary.segments.length - 1 && (
                                    <div className="layover-info">
                                      <div className="layover-dot" />
                                      <span>
                                        {Math.round((new Date(itinerary.segments[segmentIndex + 1].departure.at) - new Date(segment.arrival.at)) / 1000 / 60)}m layover in {segment.arrival.iataCode}
                                      </span>
                                </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}

                          <div className="tourCard__info">
                            <div className="tourCard__price">
                              <span>{currency}</span>
                              <span>{convertPrice(flight.price.total)}</span>
                            </div>

                            <button
                              className="button"
                              onClick={() => handleBookNow(flight)}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '1.5rem', color: '#718096' }}>No flights available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FlightResults;