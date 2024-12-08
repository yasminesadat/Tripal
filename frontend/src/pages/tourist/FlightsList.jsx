import { useState, useEffect } from 'react';
import { Plane, Clock, Calendar } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTouristAge } from '../../api/TouristService';
import { getConversionRate,getTouristCurrency } from '../../api/ExchangeRatesService';
import { message } from 'antd';
import MetaComponent from "@/components/common/MetaComponent";
import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

const metadata = {
  title: "Flight Results | Tripal",
};

const FlightResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const flights = location.state?.flights || [];
  const originCityCode = location.state?.originLocationCode;
  const destCityCode = location.state?.destinationLocationCode;
  const [currency, setCurrency] = useState('EGP');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [touristAge, setTouristAge] = useState(0);
  const [selectedClass, setSelectedClass] = useState('economy');


  const getExchangeRate = async () => {
    if (currency) {
      try {
        const rate = await getConversionRate(currency);
        setExchangeRate(rate);
      } catch (error) {
        message.error("Failed to fetch exchange rate.");
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1);  return () => clearInterval(intervalId);
  }, [currency]);

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

  const parseDuration = (duration) => {
    const regex = /^PT(\d+H)?(\d+M)?$/;
    const match = duration.match(regex);
    const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    return `${hours}h ${minutes}m`;
  };

  // Rotate plane icon calculation
  const calculatePlaneRotation = (departure, arrival) => {
    const departLat = departure.lat || 0;
    const departLon = departure.lon || 0;
    const arrivalLat = arrival.lat || 0;
    const arrivalLon = arrival.lon || 0;

    const angle = Math.atan2(arrivalLat - departLat, arrivalLon - departLon) * (180 / Math.PI);
    return angle;
  };

  const convertPrice = (price) => {
    return (price * exchangeRate).toFixed(2);
  };

  // Mock data for amenities based on selected class
  const classAmenities = {
    economy: [
      { icon: <Plane size={18} />, label: 'Wi-Fi' },
      { icon: <Plane size={18} />, label: 'Snacks' },
    ],
    business: [
      { icon: <Plane size={18} />, label: 'Lounge Access' },
      { icon: <Plane size={18} />, label: 'Premium Meals' },
    ],
    first: [
      { icon: <Plane size={18} />, label: 'Private Suite' },
      { icon: <Plane size={18} />, label: 'Fine Dining' },
    ]
  };

  return (
    <>
      <style>{`
        .flight-container {
          max-width: 1400px;
          margin: 20px auto;
          padding: 20px 40px;
        }

        .flights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          padding: 20px;
        }

        .ticket {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          height: fit-content;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid #E2E8F0;
          transition: transform 0.2s ease;
        }

        .ticket:hover {
          transform: translateY(-4px);
        }

        .ticket-header {
          background: #dac4d0;
          padding: 24px 32px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ticket-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .ticket-header span {
          font-size: 16px;
        }

        .flight-segment {
          padding: 32px;
        }

        .flight-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .city-info {
          text-align: left;
        }

        .city-code {
          font-size: 32px;
          font-weight: 700;
          color: #1E293B;
          margin-bottom: 8px;
        }

        .flight-time {
          color: #64748B;
          font-size: 18px;
          margin-bottom: 4px;
        }

        .flight-date {
          color: #94A3B8;
          font-size: 16px;
        }

        .flight-path {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 32px;
        }

        .path-line {
          height: 2px;
          background: #E2E8F0;
          width: 100%;
          position: absolute;
        }

        .plane-icon {
          color: #0D9488;
          position: relative;
          transform: rotate(45deg);
        }

        .flight-info {
          display: flex;
          gap: 32px;
          color: #64748B;
          font-size: 16px;
          padding-top: 24px;
          border-top: 1px solid #E2E8F0;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ticket-footer {
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #E2E8F0;
        }

        .price-label {
          color: #64748B;
          font-size: 16px;
          margin-bottom: 1px;
        }

        .price-amount {
          font-size: 25px;
          font-weight: 700;
          color: #1E293B;
        }

        .currency {
          color: #64748B;
          font-size: 20px;
          margin-right: 6px;
        }

        .book-button {
          background: #8f5774;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s ease;
        }

        .book-button:hover {
          background: #dac4d0;
        }

        @media (max-width: 1400px) {
          .flights-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .flight-container {
            padding: 20px;
          }
        }

        @media (max-width: 900px) {
          .flights-grid {
            grid-template-columns: 1fr;
          }
          
          .flight-container {
            padding: 16px;
          }
          
          .ticket {
            max-width: 100%;
          }
        }
      `}</style>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <TouristHeader />
        <main className="page-content">
          <div className="flight-container">
            <div className="flights-grid">
              {flights.length > 0 ? (
                flights.map((flight, index) => (
                  <div className="ticket" key={index}>
                    <div className="ticket-header">
                      <h3>Flight Ticket</h3>
                      <span>{selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)} Class</span>
                    </div>

                    {flight.itineraries.flatMap((itinerary, itineraryIndex) =>
                      itinerary.segments.map((segment, segmentIndex) => (
                        <div className="flight-segment" key={`${itineraryIndex}-${segmentIndex}`}>
                          <div className="flight-details">
                            <div className="city-info">
                              <div className="city-code">{segment.departure.iataCode}</div>
                              <div className="flight-time">{formatTime(segment.departure.at)}</div>
                              <div className="flight-date">{formatDate(segment.departure.at)}</div>
                            </div>

                            <div className="flight-path">
                              <div className="path-line"></div>
                              <Plane className="plane-icon" size={28} />
                            </div>

                            <div className="city-info">
                              <div className="city-code">{segment.arrival.iataCode}</div>
                              <div className="flight-time">{formatTime(segment.arrival.at)}</div>
                              <div className="flight-date">{formatDate(segment.arrival.at)}</div>
                            </div>
                          </div>

                          <div className="flight-info">
                            <div className="info-item">
                              <Clock size={20} />
                              <span>Duration: {parseDuration(segment.duration)}</span>
                            </div>
                            <div className="info-item">
                              <Calendar size={20} />
                              <span>{itineraryIndex === 0 ? 'Outbound' : 'Return'}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    <div className="ticket-footer">
                      <div>
                        <div className="price-label">Total Price</div>
                        <div className="price-amount">
                          <span className="currency">{currency}</span>
                          {convertPrice(flight.price.total)}
                        </div>
                      </div>
                      <button className="book-button" onClick={() => handleBookNow(flight)}>
                        Book Now
                        <Plane size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '1.2rem', color: '#718096', gridColumn: '1 / -1' }}>No flights available.</p>
              )}
            </div>
          </div>
        </main>
        <FooterThree />
      </div>
    </>
  );
};

export default FlightResults;