import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import flightBackground from '../../../public/img/flights/flight background.png';

import { message } from "antd";
import dayjs from "dayjs"; // Add dayjs for date comparison
export default function FlightSearch() {
  const [originLocationCode, setOriginLocationCode] = useState("");
  const [destinationLocationCode, setDestinationLocationCode] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [cabinType, setCabinType] = useState("ECONOMY");
  const [originSearchData, setOriginSearchData] = useState([]);
  const [destinationSearchData, setDestinationSearchData] = useState([]);
  const [originActive, setOriginActive] = useState(false);
  const [destinationActive, setDestinationActive] = useState(false);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const navigate = useNavigate();
  const originRef = useRef();
  const destinationRef = useRef();
  const debounceTimeout = useRef(null);
  const dropDownContainer = useRef();

  const fetchCityCode = async (searchInfo, setData) => {
    try {
      if (searchInfo.length < 3 || searchInfo.length > 10) {
        setData([]);
        return;
      }
      const response = await axios.get(`http://localhost:5050/api/flightCity?searchinfo=${searchInfo}`);

      // Filter out cities without a valid city code
      const transformedData = response.data
        .filter(city => city.iataCode) // Only include cities with a valid iataCode
        .map((city) => ({
          cityCode: city.iataCode,
          title: city.name,
          location: city.address.countryCode,
        }));

      setData(transformedData);
    } catch (error) {
      console.error("Error fetching city codes", error);
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
    const today = dayjs().format("YYYY-MM-DD");

    if (departureDate && dayjs(departureDate).isBefore(today)) {
      message.error("Departure date cannot be in the past.");
      return;
    }

    if (returnDate && dayjs(returnDate).isBefore(today)) {
      message.error("Return date cannot be in the past.");
      return;
    }
    try {
      const queryParams = new URLSearchParams({
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults: numberOfAdults,
        max: 150,
        cabin: cabinType,
        currencyCode: 'EGP'
      });

      if (returnDate) {
        queryParams.append("returnDate", returnDate);
      }

      const response = await axios.get(`http://localhost:5050/api/flightSearch?${queryParams.toString()}`);
      navigate("/tourist/search-flights", { state: { flights: response.data, originLocationCode: originLocationCode, destinationLocationCode: destinationLocationCode } });
    } catch (error) {
      message.error("Error fetching flights", error);
    }
  };

  return (
    <section className="hero -type-5">
      <div className="hero__bg">
        <img src="/img/hero/5/bg.png" alt="background" />
      </div>

      <div className="hero__image">
        <img
        src="/img/flights/flight background.png"
        style={{ height: "100%", width: "auto" }}
        alt="Flight Background"
        />
        </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="hero__content">


              <h1 data-aos="fade-up" data-aos-delay="300" className="hero__title">
                Search Your Next <br className="md:d-none" />
                <span className="text-accent-2">Flight</span>
              </h1>
              <div data-aos="fade-up" data-aos-delay="100" className="hero__subtitle mb-10">
                Search, compare and book flights easily.
              </div>

              <div data-aos="fade-up" data-aos-delay="400" className="hero__filter mt-60 md:mt-30">
                <div
                  className="searchForm -type-1 shadow-2 rounded-200 p-4 bg-white"
                  style={{
                    minHeight: "12rem", // Adjusted from px to rem
                    padding: '5rem', // Adjusted padding to rem for more flexibility
                    position: "center",
                  }}
                >
                  <div className="searchForm__form">
                    <div className="searchFormItem mb-3">
                      <label htmlFor="originLocation" style={{ fontWeight: 'bold' }}>Origin Location</label>
                      <input
                        id="originLocation"
                        type="text"
                        placeholder="Enter Origin Location"
                        value={originInput} // Set the input field value to originInput state
                        onChange={(e) => handleInputChange(e, setOriginSearchData, setOriginActive, setOriginInput)}
                        className="input"
                      />
                      {originActive && (
                        <div className="dropdown">
                          {originSearchData.map((city, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setOriginLocationCode(city.cityCode);
                                setOriginInput(city.title); // Update the input with the selected city's name
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

                    <div className="searchFormItem mb-3">
                      <label htmlFor="destinationLocation" style={{ fontWeight: 'bold' }}>Destination Location</label>
                      <input
                        id="destinationLocation"
                        type="text"
                        placeholder="Enter Destination Location"
                        value={destinationInput} // Set the input field value to destinationInput state
                        onChange={(e) => handleInputChange(e, setDestinationSearchData, setDestinationActive, setDestinationInput)}
                        className="input"
                      />
                      {destinationActive && (
                        <div className="dropdown">
                          {destinationSearchData.map((city, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setDestinationLocationCode(city.cityCode);
                                setDestinationInput(city.title); // Update the input with the selected city's name
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

                    <div className="searchFormItem mb-3">
                      <label htmlFor="departureDate" style={{ fontWeight: 'bold' }}>Departure Date</label>
                      <input
                        id="departureDate"
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div className="searchFormItem mb-3">
                      <label htmlFor="returnDate" style={{ fontWeight: 'bold' }}>Return Date</label>
                      <input
                        id="returnDate"
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div className="searchFormItem mb-3">
                      <label htmlFor="numberOfAdults" style={{ fontWeight: 'bold' }}>Number of Adults</label>
                      <input
                        id="numberOfAdults"
                        type="number"
                        placeholder="Enter Number of Adults"
                        value={numberOfAdults}
                        onChange={(e) => setNumberOfAdults(e.target.value)}
                        className="input"
                        min="1"
                        style={{ textAlign: 'center' }}
                      />
                    </div>

                    <div className="searchFormItem mb-3">
                      <label htmlFor="cabinType" style={{ fontWeight: 'bold' }}>Cabin Type</label>
                      <select
                        id="cabinType"
                        value={cabinType}
                        onChange={(e) => setCabinType(e.target.value)}
                        className="input"
                      >
                        <option value="ECONOMY">Economy</option>
                        <option value="PREMIUM_ECONOMY">Premium Economy</option>
                        <option value="BUSINESS">Business</option>
                        <option value="FIRST">First</option>
                      </select>
                    </div>
                  </div>

                  <div
                    className="searchForm__button"
                    style={{
                      position: "center",
                      bottom: "1rem", // Adjusted to rem
                      width: "auto", // Changed from 5% to auto for more responsiveness
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={handleSearch}
                      className="button -dark-1 bg-accent-2 rounded-200 text-white transition duration-300 hover:bg-accent-3"
                    >
                      <span className="mr-3">
                        <i className="fa fa-search" />
                      </span>
                      Search Flight
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}      