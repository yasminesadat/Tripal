import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTouristActivities, getTouristFlights, getTouristItineraries } from "../../api/TouristService";
import { getHotelHistory } from "../../api/HotelService"; //from service 
import { format } from 'date-fns';
import { getConversionRate } from "../../api/ExchangeRatesService";
import MetaComponent from "@/components/common/MetaComponent";
import TouristHeader from "@/components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
const tabs = ["Flights", "Hotels", "Activities", "Itineraries"];

export default function DbBooking() {
  const [currentTab, setCurrentTab] = useState("Flights");
  const [bookedFlights, setBookedFlights] = useState([]); //stored flights
  const [bookedHotels, setBookedHotels] = useState([]); // state to store bookedHotels
  const [bookedActivities, setBookedActivities] = useState([]); 
  const [bookedItineraries, setBookedItineraries] = useState([]); 
  const [currency, setCurrency] = useState('EGP');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  
  // for testing dont delete
  // const bookedActivities = [
  //   {
  //     _id: "1",
  //     title: "Yoga Class",
  //     category: "Fitness",
  //     date: "2024-12-05T10:00:00Z",  // Future date (Upcoming)
  //     time: "10:00 AM",
  //     price: "$20",
  //   },
  //   {
  //     _id: "6731e8e77b527c9ad2c44aea",
  //     title: "Cooking Workshop",
  //     category: "Food",
  //     date: "2024-11-25T15:00:00Z",  // Past date (Completed)
  //     time: "3:00 PM",
  //     price: "$50",
  //   },
  //   {
  //     _id: "3",
  //     title: "Art Exhibition",
  //     category: "Art",
  //     date: "2024-12-10T12:00:00Z",  // Future date (Upcoming)
  //     time: "12:00 PM",
  //     price: "$30",
  //   },
  //   {
  //     _id: "4",
  //     title: "Dance Class",
  //     category: "Fitness",
  //     date: "2024-11-20T18:00:00Z",  // Past date (Completed)
  //     time: "6:00 PM",
  //     price: "$25",
  //   },
  //   {
  //     _id: "5",
  //     title: "Tech Conference",
  //     category: "Technology",
  //     date: "2024-12-15T09:00:00Z",  // Future date (Upcoming)
  //     time: "9:00 AM",
  //     price: "$100",
  //   },
  //   {
  //     _id: "6",
  //     title: "Music Concert",
  //     category: "Entertainment",
  //     date: "2024-11-10T20:00:00Z",  // Past date (Completed)
  //     time: "8:00 PM",
  //     price: "$75",
  //   },
  //   {
  //     _id: "7",
  //     title: "Photography Workshop",
  //     category: "Photography",
  //     date: "2024-12-03T14:00:00Z",  // Future date (Upcoming)
  //     time: "2:00 PM",
  //     price: "$40",
  //   },
  // ];
  

  useEffect(() => {

    const fetchCurrency = () => {
      const curr = sessionStorage.getItem('currency');
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

    const fetchBookedActivities = async () => {
      try {
        const response = await getTouristActivities();
        console.log("activities",response)
        setBookedActivities(response);
      } catch (error) {
        console.error("Error fetching booked activities", error);
      }
    };

    const fetchBookedItineraries = async () => {
      try {
        const response = await getTouristItineraries();
        console.log("itineraries", response);
        setBookedItineraries(response);
      } catch (error) {
        console.error("Error fetching booked itineraries", error);
      }
    };

    fetchBookedFlights();
    fetchBookedHotels();
    fetchBookedActivities();
    fetchBookedItineraries();
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
    title: "Home || Tripal",
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');  
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

const checkActivityStatus = (activityDate) => {
  const today = new Date();
  const activityDateObj = new Date(activityDate);

  if (activityDateObj > today) {
    return { stat: 'upcoming ', icon: '⏳' }; 
  } else {
    return { stat: 'completed ', icon: '✔️' };
  }
};

const navigate = useNavigate();
const handleRedirect = (activityId) => {
  navigate(`/activity/${activityId}`, { state: { page: 'history' }});
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

                              {/* Activities Tab */}
                              {currentTab === "Activities" && (
                                <div className="tabs__pane -tab-item-1 is-tab-el-active">
                                  <div className="overflowAuto">
                                    <table className="tableTest mb-30">
                                      <thead className="bg-light-1 rounded-12">
                                        <tr>
                                          <th>Activity Title</th>
                                          <th>Category</th>
                                          <th>Date</th>
                                          <th>Time</th>
                                          <th>Price</th>
                                          <th>Status</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {bookedActivities.map((activity, i) => {
                                          const { stat, icon } = checkActivityStatus(activity.date);
                                          
                                          const actionButton = stat === "upcoming " ? (
                                            <button
                                              style={{
                                                backgroundColor: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                              }}
                                              onMouseOver={(e) => (e.target.style.backgroundColor = '#c0392b')} 
                                              onMouseOut={(e) => (e.target.style.backgroundColor = '#e74c3c')} 
                                            >
                                              Cancel
                                            </button>
                                          ) : (
                                            <button
                                              style={{
                                                backgroundColor: '#2ecc71',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                              }}
                                              onMouseOver={(e) => (e.target.style.backgroundColor = '#27ae60')} 
                                              onMouseOut={(e) => (e.target.style.backgroundColor = '#2ecc71')} 
                                              onClick={() => handleRedirect(activity._id)}
                                            >
                                              Review
                                            </button>
                                          );
                                          return (
                                            <tr key={i}>
                                              <td>{activity.title}</td>
                                              <td>{activity.category}</td>    
                                              <td>{formatDate(activity.date)}</td>
                                              <td>{activity.time}</td>
                                              <td>{activity.price}</td>
                                              <td>
                                                {stat}
                                                <span style={{ fontSize: '18px' }}>{icon}</span>
                                              </td>
                                              <td>{actionButton}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="text-14 text-center mt-20">
                                    Showing results {bookedActivities.length} of {bookedActivities.length}
                                  </div>
                                </div>
                              )}

                              {/* Itineraries Tab Content */}
                              {currentTab === "Itineraries" && (
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
