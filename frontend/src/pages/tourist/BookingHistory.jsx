import React, { useState, useEffect } from "react";
import { getTouristFlights } from "../../api/TouristService";
import { getHotelHistory } from "../../api/HotelService"; //from service 
import { format } from 'date-fns';
import { getConversionRate } from "../../api/ExchangeRatesService";
import MetaComponent from "@/components/common/MetaComponent";
import TouristHeader from "@/components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
const tabs = ["Flights", "Hotels"];

export default function DbBooking() {
  const [currentTab, setCurrentTab] = useState("Flights");
  const [bookedFlights, setBookedFlights] = useState([]); //stored flights
  const [bookedHotels, setBookedHotels] = useState([]); // state to store bookedHotels
  const [currency, setCurrency] = useState('EGP');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [sideBarOpen, setSideBarOpen] = useState(true);


  useEffect(() => {

    const fetchCurrency = () => {
      const curr = sessionStorage.getItem('currency');
      console.log(sessionStorage)
      if (curr) {
        setCurrency(curr);
        fetchExchangeRate(curr);
      }
    };
    fetchCurrency();

    const fetchBookedFlights = async () => {
      try {
        const response = await getTouristFlights();
        console.log("Flights API Response:", response);
        setBookedFlights(response.bookedFlights);
      } catch (error) {
        console.error("Error fetching booked flights", error);
      }
    };




    const fetchBookedHotels = async () => {
      try {
        const response = await getHotelHistory();
        console.log("Hotels API Response:", response);
        setBookedHotels(response.bookedHotels);
      } catch (error) {
        console.error("Error fetching booked hotels", error);
      }
    };

    fetchBookedFlights();
    fetchBookedHotels();
  }, []);

  
  const fetchExchangeRate = async (curr) => {
    try {
      const rate = await getConversionRate(curr);
      setExchangeRate(rate);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    }
  };
  const getFlightStatus = (arrivalTime) => {
    const now = new Date();
    return new Date(arrivalTime) < now ? "Flight Complete" : "Flight Upcoming";
  };

  const getHotelStatus = (checkout) => {
    const now = new Date();
    return new Date(checkout) < now ? "completed" : "confirmed";
  };

  const convertPrice = (price) => {
    return (price * exchangeRate).toFixed(2);
  };

  const metadata = {
    title: "Home || Tripal - Travel Agency",
};

  return (
    <div>
      <>
            <MetaComponent meta={metadata} />
            <div className="page-wrapper">
                <TouristHeader />
                <main className="page-content">
                  <div className="dashboard js-dashboard">

                    <div className="dashboard__content">
                      <div className="dashboard__content_content">
                        <h1 className="text-30">My Bookings</h1>

                        <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20 mt-60">
                          <div className="tabs -underline-2 js-tabs">
                            <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
                              {tabs.map((elm, i) => (
                                <div key={i} className="col-auto" onClick={() => setCurrentTab(elm)}>
                                  <button
                                    className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${elm === currentTab ? "is-tab-el-active" : ""
                                      }`}
                                  >
                                    {elm}
                                  </button>
                                </div>
                              ))}
                            </div>

                            <div className="tabs__content js-tabs-content">
                              {/* Flights Tab Content */}
                              {currentTab === "Flights" && (
                                <div className="tabs__pane -tab-item-1 is-tab-el-active">
                                  <div className="overflowAuto">
                                    <table className="tableTest mb-30">
                                      <thead className="bg-light-1 rounded-12">
                                        <tr>
                                          <th>Flight Number</th>
                                          <th>Airline</th>
                                          <th>Origin</th>
                                          <th>Destination</th>
                                          <th>Price</th>
                                          <th>Departure Time</th>
                                          <th>Arrival Time</th>
                                          <th>Status</th>
                                          {/* <th>Action</th> */}
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {bookedFlights.map((flight, i) => (
                                          <tr key={i}>
                                            <td>{flight.flightNumber}</td>
                                            <td>{flight.airline}</td>
                                            <td>{flight.origin}</td>
                                            <td>{flight.destination}</td>
                                          
                                            <td>{convertPrice(flight.price)} {currency}</td>
                                            <td>{new Date(flight.departureTime).toLocaleString()}</td>
                                            <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                                            <td>
                                              <div className={`circle ${getFlightStatus(flight.arrivalTime) === "Flight Complete" ? "text-purple-1" : "text-yellow-1"}`}>
                                                {getFlightStatus(flight.arrivalTime)}
                                              </div>
                                            </td>
                                            {/* <td>
                                            <div className="d-flex items-center">
                                            <button className="button -dark-1 size-35 bg-light-1 rounded-full flex-center">
                                                <i className="icon-pencil text-14"></i>
                                            </button>
                                            {getFlightStatus(flight.arrivalTime) === "Flight Upcoming" && (
                                                <button className="button -dark-1 size-35 bg-light-1 rounded-full flex-center ml-10">
                                                <i className="icon-delete text-14"></i>
                                                </button>
                                            )}
                                            </div>
                                        </td> */}
                                          </tr>
                                        ))}
                                      </tbody>

                                    </table>
                                  </div>

                                  <div className="text-14 text-center mt-20">
                                    Showing results {bookedFlights.length} of {bookedFlights.length}
                                  </div>
                                </div>
                              )}

                              {/* Hotels Tab Content */}
                              {currentTab === "Hotels" && (
                                <div className="tabs__pane -tab-item-2 is-tab-el-active">
                                  <div className="overflowAuto">
                                    <table className="tableTest mb-30">
                                      <thead className="bg-light-1 rounded-12">
                                        <tr>
                                          <th>Hotel Name</th>
                                          <th>Location</th>
                                          <th>Check-in Date</th>
                                          <th>Check-out Date</th>
                                          <th>Total Price</th>
                                          <th>Status</th>
                                          {/* <th>Action</th> */}
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {bookedHotels.map((hotel, i) => (
                                          <tr key={i}>
                                            <td>{hotel.hotelname}</td>
                                            <td>{hotel.cityCode}</td>
                                            <td>{format(hotel.checkIn, 'M/d/yyyy, h:mm:ss a')}</td>
                                            <td>{format(hotel.checkOut, 'M/d/yyyy, h:mm:ss a')}</td>
                                            {/* <td>{hotel.pricing} EGP</td> */}
                                            <td>{convertPrice(hotel.pricing)} {currency}</td>
                                            <td>
                                              <div className={`circle ${getHotelStatus(hotel.checkOut) === "completed" ? "text-purple-1" : "text-yellow-1"}`}>
                                                {getHotelStatus(hotel.checkOut)}
                                              </div>
                                            </td>
                                            {/* <td>
                                            <div className="d-flex items-center">
                                              <button className="button -dark-1 size-35 bg-light-1 rounded-full flex-center">
                                                <i className="icon-pencil text-14"></i>
                                              </button>
                                              <button className="button -dark-1 size-35 bg-light-1 rounded-full flex-center ml-10">
                                                <i className="icon-delete text-14"></i>
                                              </button>
                                            </div>
                                          </td> */}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="text-14 text-center mt-20">
                                    Showing results {bookedHotels.length} of {bookedHotels.length}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                       
                      </div>
                    </div>
                    </div>

                </main>
                <FooterThree />
            </div>
        </>
 </div>
  );
}
