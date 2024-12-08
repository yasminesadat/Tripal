import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Tour, message } from 'antd';
import dayjs from 'dayjs';
import { MapPin, ArrowRightLeft, ArrowLeftRight, Users, ChevronDown, Search, ArrowRight } from 'lucide-react';
import MetaComponent from "@/components/common/MetaComponent";
import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
const metadata = {
  title: "Flights Search || Tripal",
  description: "Flights Search || Tripal",
};

export default function FlightsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [originLocationCode, setOriginLocationCode] = useState('');
  const [destinationLocationCode, setDestinationLocationCode] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [originSearchData, setOriginSearchData] = useState([]);
  const [destinationSearchData, setDestinationSearchData] = useState([]);
  const [originActive, setOriginActive] = useState(false);
  const [destinationActive, setDestinationActive] = useState(false);
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [tripType, setTripType] = useState('roundTrip');
  const [showPassengers, setShowPassengers] = useState(false);
  const [showCabin, setShowCabin] = useState(false);
  const [showNumberOfAdults, setShowNumberOfAdults] = useState(false);
  const [showCabinType, setShowCabinType] = useState(false);
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [cabinType, setCabinType] = useState('ECONOMY');
  const originRef = useRef();
  const destinationRef = useRef();
  const debounceTimeout = useRef(null);
  const refFlightsFilter = useRef(null);
  const refFlightsExplore = useRef(null);
  const refFlightsSearch = useRef(null);
  const [open, setOpen] = useState(false);
  const [showPassengersDropdown, setShowPassengersDropdown] = useState(false);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);

  const steps = [
    {
      title: "Choose flight options",
      description: "Narrow down your flights search by specifying some options.",
      target: () => refFlightsFilter.current, 
    },
    {
      title: "Enter more details",
      description: "In order to find all the flights that match your choices available for booking.",
      target: () => refFlightsSearch.current, 
    },
    {
      title: "Start exploring!",
      description: "Hopefully you will find a match.",
      target: () => refFlightsExplore.current, 
      onFinish: () => {
        localStorage.setItem("currentStep", 2);
        setOpen(false);
        navigate("/tourist", {state: {fromTour: true, targetStep: 2}});
      }
    },
  ]

  const cabinOptions = [
    { label: 'Economy', value: 'ECONOMY' },
    { label: 'Premium Economy', value: 'PREMIUM_ECONOMY' },
    { label: 'Business', value: 'BUSINESS' },
    { label: 'First', value: 'FIRST' },
  ];

  const handleCabinSelect = (value) => {
    setCabinType(value);
    setShowCabinDropdown(false);
  };

  useEffect(() => {
    const isFromTour = location.state?.fromTour;

    if ( isFromTour && refFlightsSearch.current) {
      refFlightsSearch.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  useEffect(() => {
    const isFromTour = location.state?.fromTour;
  
    const timer = setTimeout(() => {
      if (isFromTour) {
        setOpen(true); 
      }
    }, 300);
  
    return () => clearTimeout(timer); 
  }, [location]);

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

  const handlePassengerSelect = (count) => {
    setPassengers(count);
    setShowPassengersDropdown(false); // Close the dropdown after selection
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
      sessionStorage.setItem('flightSearchParams', JSON.stringify(queryParams));

    const urlParams = new URLSearchParams({
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
            z-index: 2
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
            overflow: visible; /* Ensure the dropdown is not clipped */
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
            background: #8f5774;
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
            margin: 0 auto; /* Centers the button horizontally */
            display: block; /* Ensures margin auto works */
            }

            .search-button:hover {
              transform: translateY(-2px);
              background: #dac4d0;
              color: #036264;
              box-shadow: 0 4px 12px rgba(143, 87, 116, 0.2);
            }

              .dropdown {
              position: absolute; /* Use absolute positioning */
              top: calc(100% + 8px); /* Adjust as needed */
              left: 0;
              width: 100%; 
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              border: 1px solid #dac4d0;
              z-index: 1; /* Important: Set a higher z-index */
            }

            .dropdowns {
              position: absolute; /* Use absolute positioning */
              top: 120px /* Adjust as needed */
              left: 0;
              width: 50%; 
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              border: 1px solid #dac4d0;
              z-index: 1; /* Important: Set a higher z-index */
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

          .hero__title {
            position: relative;
            right: -180px; /* Move to the right */
            top: -50px;  /* Move up */
            z-index: 10; /* Ensure it stays above other elements */
          }

          .hero__subtitle {
            position: relative;
            right: -180px; /* Match the title's horizontal positioning */
            top: -40px;   /* Match the title's vertical positioning */
            z-index: 10;
          }
        `}
      </style>
      <style jsx global>{`
        /* Base style for all dots */
        /* Try multiple selectors and approaches */
        .ant-tour .ant-tour-indicators > span {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #dac4d0 !important;
        }
        .ant-tour .ant-tour-indicators > span[class*="active"] {
          background: #036264 !important;
        }

        /* Additional specificity */
        .ant-tour-indicators span[role="dot"][aria-current="true"] {
          background: #036264 !important;
        }

        .ant-tour .ant-tour-inner {
          border: 1px solid #5a9ea0;
          box-shadow: 0 4px 12px rgba(3, 98, 100, 0.15);
        }

        .ant-tour .ant-tour-content {
          color: #8f5774;
          font-weight: 500 !important;
          letter-spacing: 0.3px !important;
          text-rendering: optimizeLegibility !important;
        }

        .ant-tour .ant-tour-title {
          color: #5a9ea0;
          font-weight: 600;
        }

        .ant-tour .ant-tour-close {
          color: #5a9ea0;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .ant-tour .ant-tour-close:hover {
          opacity: 1;
          color: #e5f8f8;
        }

        .ant-tour .ant-tour-buttons .ant-btn {
          transition: all 0.3s ease;
        }

        .ant-tour .ant-tour-buttons .ant-btn-primary
        {
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        .ant-tour .ant-tour-buttons .ant-btn-default{
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        
        .ant-tour .ant-tour-buttons .ant-btn-primary:hover,
        .ant-tour .ant-tour-buttons .ant-btn-default:hover {
          color:white;
          background: #5a9ea0;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(3, 98, 100, 0.2);
        }
        .ant-tour .ant-tour-arrow-content {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }  
      `}</style>
      <MetaComponent meta={metadata}/>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
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

        <h1 data-aos="fade-up" data-aos-delay="300" className="hero__title">
            Plan Your <br className="md:d-none" />
            <span style={{ color: '#036264' }}>Next Journey</span>
          </h1>
          <div
            data-aos="fade-up"x
            data-aos-delay="100"
            className="hero__subtitle mb-10"
          >
            Search, compare and book flights easily.
          </div>
        

        <div className="search-container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="flight-options" ref={refFlightsFilter} style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
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

            <button className="select-button" onClick={() => setShowPassengersDropdown(!showPassengersDropdown)}>
          <Users size={16} />
          {passengers} passenger{passengers > 1 ? 's' : ''}
          <ChevronDown size={16} />
        </button>
        {showPassengersDropdown && (
          <ul className="dropdowns">
            {[1, 2, 3, 4, 5].map((count) => (
              <li key={count} onClick={() => handlePassengerSelect(count)} className="dropdown-item">
                {count} passenger{count > 1 ? 's' : ''}
              </li>
            ))}
          </ul>
        )}

        {/* Cabin Dropdown */}
        <button className="select-button" onClick={() => setShowCabinDropdown(!showCabinDropdown)}>
        {cabinOptions.find(option => option.value === cabinType)?.label}
        <ChevronDown size={16} />
      </button>
      {showCabinDropdown && (
        <ul className="dropdowns">
          {cabinOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleCabinSelect(option.value)}
              className="dropdown-item"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
          </div>

          <div className="search-grid" ref={refFlightsSearch} style={{ display: 'grid', justifyContent: 'center' }}>
            <div className="input-group" style={{ position: 'relative' }}>
              <MapPin className="location-icon" size={18} />
              <input
                type="text"
                placeholder="From where?"
                className="location-input"
                style={{
                  border: '1px solid #dac4d0',
                  outline: "none", 
                  borderRadius: '10px', 
                  transition: 'all 0.3s ease'
                }}
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
                style={{
                  border: '1px solid #dac4d0',
                  outline: "none", 
                  borderRadius: '10px', 
                  transition: 'all 0.3s ease'
                }}
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
            ref={refFlightsExplore}
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
