import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import dayjs from 'dayjs';
import { MapPin, ArrowRightLeft, ArrowLeftRight, Users, ChevronDown, Search, ArrowRight } from 'lucide-react';
import MetaComponent from "@/components/common/MetaComponent";
import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

export default function FlightSearchUI() {
  const [originLocationCode, setOriginLocationCode] = useState('');
  const [destinationLocationCode, setDestinationLocationCode] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinType, setCabinType] = useState('ECONOMY');
  const [originSearchData, setOriginSearchData] = useState([]);
  const [destinationSearchData, setDestinationSearchData] = useState([]);
  const [originActive, setOriginActive] = useState(false);
  const [destinationActive, setDestinationActive] = useState(false);
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [tripType, setTripType] = useState('roundTrip');
  const [showPassengers, setShowPassengers] = useState(false);
  const [showCabin, setShowCabin] = useState(false);

  const navigate = useNavigate();
  const originRef = useRef();
  const destinationRef = useRef();
  const debounceTimeout = useRef(null);

  const fetchCityCode = async (searchInfo, setData) => {
    try {
      if (searchInfo.length < 3 || searchInfo.length > 10) {
        setData([]);
        return;
      }
      const response = await axios.get(`http://localhost:5050/api/flightCity?searchinfo=${searchInfo}`);

      const transformedData = response.data
        .filter(city => city.iataCode)
        .map((city) => ({
          cityCode: city.iataCode,
          title: city.name,
          location: city.address.countryCode,
        }));

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching city codes', error);
    }
  };

  const handleInputChange = (e, setSearchData, setActive, setInputValue) => {
    const inputValue = e.target.value;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchCityCode(inputValue, setSearchData);
      setActive(true);
      setInputValue(inputValue);
    }, 50);
  };

  const handleSearch = async () => {
    const today = dayjs().format('YYYY-MM-DD');

    if (departureDate && dayjs(departureDate).isBefore(today)) {
      message.error('Departure date cannot be in the past.');
      return;
    }

    if (returnDate && dayjs(returnDate).isBefore(today)) {
      message.error('Return date cannot be in the past.');
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults: passengers,
        max: 150,
        cabin: cabinType,
        currencyCode: 'EGP',
      });

      if (tripType === 'roundTrip' && returnDate) {
        queryParams.append('returnDate', returnDate);
      }

      const response = await axios.get(`http://localhost:5050/api/flightSearch?${queryParams.toString()}`);
      navigate('/tourist/search-flights', { state: { flights: response.data, originLocationCode, destinationLocationCode } });
    } catch (error) {
      message.error('Error fetching flights', error);
    }
  };

  return (
    <>
      <style>
        {`
          .search-container {
            background: white;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
            max-width: 1200px;
            margin: 0 auto;
          }

          .flight-options {
            display: flex;
            align-items: center;
            gap: 24px;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(218, 196, 208, 0.3);
          }

          .search-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 2fr;
            gap: 12px;
            align-items: center;
          }

          .input-group {
            position: relative;
            width: 100%;
          }

          .select-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border: 1px solid #dac4d0;
            border-radius: 8px;
            background: white;
            color: #036264;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .select-button:hover {
            border-color: #8f5774;
          }

          .select-button.active {
            border-color: #8f5774;
            background: rgba(143, 87, 116, 0.05);
          }

          .location-input {
            width: 100%;
            padding: 12px;
            padding-left: 40px;
            border: 1px solid #dac4d0;
            border-radius: 8px;
            font-size: 1rem;
            color: #036264;
            transition: all 0.2s ease;
          }

          .location-input:focus {
            outline: none;
            border-color: #8f5774;
            box-shadow: 0 0 0 3px rgba(143, 87, 116, 0.1);
          }

          .location-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #8f5774;
          }

          .swap-icon {
            width: 32px;
            height: 32px;
            background: #e5f8f8;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #036264;
            cursor: pointer;
            transition: all 0.2s ease;
            position: absolute;
            left: -16px;
            top: 50%;
            transform: translateY(-50%);
          }

          .swap-icon:hover {
            background: #dac4d0;
            color: #8f5774;
          }

          .dates-container {
            display: flex;
            gap: 12px;
            border: 1px solid #dac4d0;
            border-radius: 8px;
            padding: 8px 16px;
          }

          .date-group {
            flex: 1;
            position: relative;
          }

          .date-group:first-child::after {
            content: '';
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
            height: 24px;
            width: 1px;
            background: #dac4d0;
          }

          .date-label {
            font-size: 0.75rem;
            color: #5a9ea0;
            margin-bottom: 4px;
          }

          .date-input {
            border: none;
            outline: none;
            color: #036264;
            font-size: 0.9rem;
            width: 100%;
          }

          .search-button {
  padding: 12px 32px;
  background: linear-gradient(135deg, #e0829d, #8f5774);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center; /* Align content vertically */
  justify-content: center; /* Center content horizontally */
  gap: 8px;
  transition: all 0.2s ease;
  margin-top: 24px;
}

          .search-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(143, 87, 116, 0.2);
          }

          .dropdown {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            width: 100%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid #dac4d0;
            z-index: 10;
          }

          .dropdown-item {
            padding: 12px 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #036264;
          }

          .dropdown-item:hover {
            background: #e5f8f8;
          }
        `}
      </style>
      <MetaComponent />
      <TouristHeader />
      <section className="hero -type-5">
        <div className="hero__bg">
          <img src="/img/hero/5/bg.png" alt="background" />
        </div>
        <div className="hero__image">
        <img
  src="/img/flights/flight background.png"
  style={{ height: '100%', width: 'auto' }}
  alt="Flight Background"
/>
        </div>

        <div className="search-container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="flight-options" style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
            <button
              className={`select-button ${tripType === 'roundTrip' ? 'active' : ''}`}
              onClick={() => setTripType('roundTrip')}
            >
              <ArrowLeftRight size={16} />
              Round trip
              
            </button>

            <button
              className={`select-button ${tripType === 'oneWay' ? 'active' : ''}`}
              onClick={() => {
                setTripType('oneWay');
                setReturnDate(''); // Clear return date when selecting one-way trip
              }}
            >
              <ArrowRight size={16} />
              One way
            </button>

            <button className="select-button" onClick={() => setShowPassengers(!showPassengers)}>
              <Users size={16} />
              {passengers} passenger{passengers > 1 ? 's' : ''}
              <ChevronDown size={16} />
            </button>

            <button className="select-button" onClick={() => setShowCabin(!showCabin)}>
              {cabinType}
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="search-grid" style={{ display: 'grid', justifyContent: 'center' }}>
            <div className="input-group" style={{ position: 'relative' }}>
              <MapPin className="location-icon" size={18} />
              <input
                type="text"
                placeholder="From where?"
                className="location-input"
                value={originInput}
                onChange={(e) => handleInputChange(e, setOriginSearchData, setOriginActive, setOriginInput)}
              />
              {originActive && (
                <div className="dropdown">
                  {originSearchData.map((city, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setOriginLocationCode(city.cityCode);
                        setOriginInput(city.title);
                        setOriginActive(false);
                      }}
                      className="dropdown-item"
                    >
                      {city.title} ({city.cityCode}), {city.location}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="input-group" style={{ position: 'relative' }}>
              <div className="swap-icon" onClick={() => {
                const temp = originLocationCode;
                setOriginLocationCode(destinationLocationCode);
                setDestinationLocationCode(temp);
                const tempInput = originInput;
                setOriginInput(destinationInput);
                setDestinationInput(tempInput);
              }}>
                <ArrowRightLeft size={16} />
              </div>
              <MapPin className="location-icon" size={18} />
              <input
                type="text"
                placeholder="Where to?"
                className="location-input"
                value={destinationInput}
                onChange={(e) => handleInputChange(e, setDestinationSearchData, setDestinationActive, setDestinationInput)}
              />
              {destinationActive && (
                <div className="dropdown">
                  {destinationSearchData.map((city, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setDestinationLocationCode(city.cityCode);
                        setDestinationInput(city.title);
                        setDestinationActive(false);
                      }}
                      className="dropdown-item"
                    >
                      {city.title} ({city.cityCode}), {city.location}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dates-container" style={{ display: 'flex', gap: '12px' }}>
              <div className="date-group">
                <div className="date-label">Departure</div>
                <input
                  type="date"
                  className="date-input"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
              {tripType === 'roundTrip' && (
                <div className="date-group">
                  <div className="date-label">Return</div>
                  <input
                    type="date"
                    className="date-input"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            className="search-button"
            onClick={handleSearch}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}
          >
            <Search size={20} />
            Explore
          </button>
        </div>
      </section>
<FooterThree />
    </>
  );
}