import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Hero5() {
    const [originLocationCode, setOriginLocationCode] = useState("");
    const [destinationLocationCode, setDestinationLocationCode] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [numberOfAdults, setNumberOfAdults] = useState(1);
    const [cabinType, setCabinType] = useState("ECONOMY");
    const navigate = useNavigate();

    const dropDownContainer = useRef();

    useEffect(() => {
        const handleClick = (event) => {
            if (dropDownContainer.current && !dropDownContainer.current.contains(event.target)) {
                // handle click outside the dropdown container
            }
        };

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    const handleSearch = async () => {
        try {
            // Build the query string for the flight search
            const queryParams = new URLSearchParams({
                originLocationCode,
                destinationLocationCode,
                departureDate,
                adults: numberOfAdults,
                max: 3,
                cabin: cabinType,
                currencyCode: 'EGP'
            });

            // If returnDate exists, add it to the query parameters
            if (returnDate) {
                queryParams.append("returnDate", returnDate);
            }

            // Make the API request with the dynamic query parameters
            const response = await axios.get(`http://localhost:5050/api/flightSearch?${queryParams.toString()}`);
            console.log("Search Results:", response.data);
            navigate("/tourist/book-flight", { state: { flights: response.data } });
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    return (
        <section className="hero -type-5">
            <div className="hero__bg">
                <img src="/img/hero/5/bg.png" alt="background" />
            </div>

            <div className="hero__image">
                <img src="/img/hero/5/shape.svg" style={{ height: "100%", width: "auto" }} alt="image" />
                <img src="/img/hero/5/1.jpg" alt="image" />
                <img src="/img/hero/5/mobile.svg" alt="image" />
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="hero__content">
                            <div data-aos="fade-up" data-aos-delay="100" className="hero__subtitle mb-10">
                                Search, compare and book flights easily.
                            </div>

                            <h1 data-aos="fade-up" data-aos-delay="300" className="hero__title">
                                Search Your Next <br className="md:d-none" />
                                <span className="text-accent-2">Flight</span>
                            </h1>

                            <div data-aos="fade-up" data-aos-delay="400" className="hero__filter mt-60 md:mt-30">
                                <div ref={dropDownContainer} className="searchForm -type-1 shadow-1 rounded-200">
                                    <div className="searchForm__form">
                                        <div className="searchFormItem">
                                            <input
                                                type="text"
                                                placeholder="Origin Location Code"
                                                value={originLocationCode}
                                                onChange={(e) => setOriginLocationCode(e.target.value)}
                                                className="input"
                                            />
                                        </div>

                                        <div className="searchFormItem">
                                            <input
                                                type="text"
                                                placeholder="Destination Location Code"
                                                value={destinationLocationCode}
                                                onChange={(e) => setDestinationLocationCode(e.target.value)}
                                                className="input"
                                            />
                                        </div>

                                        <div className="searchFormItem">
                                            <input
                                                type="date"
                                                placeholder="Departure Date"
                                                value={departureDate}
                                                onChange={(e) => setDepartureDate(e.target.value)}
                                                className="input"
                                            />
                                        </div>

                                        <div className="searchFormItem">
                                            <input
                                                type="date"
                                                placeholder="Return Date"
                                                value={returnDate}
                                                onChange={(e) => setReturnDate(e.target.value)}
                                                className="input"
                                            />
                                        </div>

                                        <div className="searchFormItem">
                                            <input
                                                type="number"
                                                placeholder="Number of Adults"
                                                value={numberOfAdults}
                                                onChange={(e) => setNumberOfAdults(e.target.value)}
                                                className="input"
                                                min="1"
                                            />
                                        </div>

                                        <div className="searchFormItem">
                                            <select
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

                                    <div className="searchForm__button">
                                        <button
                                            onClick={handleSearch}
                                            className="button -dark-1 bg-accent-2 rounded-200 text-white"
                                        >
                                            <i className="icon-search text-16 mr-10"></i>
                                            Search
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
