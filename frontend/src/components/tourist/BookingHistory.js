import React, { useState, useEffect } from "react";

import { getTouristFlights } from "../../api/TouristService";
import { touristId } from "../../IDs";
const tabs = ["Flights", "Hotels"];

export default function DbBooking() {
  const [currentTab, setCurrentTab] = useState("Approved");
  const [bookedFlights, setBookedFlights] = useState([]); // state to store bookedFlights

  useEffect(() => {
    const fetchBookedFlights = async () => {
        try {
          const response = await getTouristFlights(touristId);
          console.log("API Response:", response);
          setBookedFlights(response.bookedFlights);
        } catch (error) {
          console.error("Error fetching booked flights", error);
        }
      };
    fetchBookedFlights();
  }, []);

  const getFlightStatus = (arrivalTime) => {
    const now = new Date();
    return new Date(arrivalTime) < now ? "Flight Complete" : "Flight Upcoming";
  };

  return (
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
                      className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${
                        elm === currentTab ? "is-tab-el-active" : ""
                      }`}
                    >
                      {elm}
                    </button>
                  </div>
                ))}
              </div>
  
              <div className="tabs__content js-tabs-content">
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
                          <th>Action</th>
                        </tr>
                      </thead>
  
                      <tbody>
                        {bookedFlights.map((flight, i) => (
                          <tr key={i}>
                            <td>{flight.flightNumber}</td>
                            <td>{flight.airline}</td>
                            <td>{flight.origin}</td>
                            <td>{flight.destination}</td>
                            <td>{flight.price} {flight.currency}</td>
                            <td>{new Date(flight.departureTime).toLocaleString()}</td>
                            <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                            <td>
                              <div className={`circle ${getFlightStatus(flight.arrivalTime) === "Flight Complete" ? "text-purple-1" : "text-yellow-1"}`}>
                                {getFlightStatus(flight.arrivalTime)}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex items-center">
                                <button className="button -dark-1 size-35 bg-light-1 rounded-full flex-center">
                                  <i className="icon-pencil text-14"></i>
                                </button>
                                <button className="button -dark-1 size-35 bg-light-1 rounded-full flex-center ml-10">
                                  <i className="icon-delete text-14"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
  
                  <div className="text-14 text-center mt-20">
                    Showing results {bookedFlights.length} of {bookedFlights.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="text-center pt-30">
            © Copyright Viatours {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
  
}
