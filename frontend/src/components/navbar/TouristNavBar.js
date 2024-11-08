import React from "react";
import { Link } from "react-router-dom";
import { touristId } from "../../IDs";

const TouristNavBar = () => {
  return (
    <nav>
      <div class="nav-bar">
        <div class="nav-bar-link">
          <Link to="/tourist">Home</Link>
        </div>


        <div className="nav-bar-link dropdown">
          <button className="dropbtn">Activities</button>
          <div className="dropdown-content">
            <Link to="/activities-history">Activities History</Link>
            <Link to="/booked-activities">Booked Activities</Link>
            <Link to="/upcoming-activities">Upcoming Activities</Link>          </div>
        </div>
        <div className="nav-bar-link dropdown">
          <button className="dropbtn">Itineraries</button>
          <div className="dropdown-content">
            <Link to="/itineraries-history">Itineraries History</Link>
            <Link to="/upcoming-itineraries">Upcoming Itineraries</Link>
            <Link to="/itineraries/booked-itineraries">Booked Itineraries</Link>
          </div>
        </div>


        <div class="nav-bar-link">
          <Link to="/historical-places">Historical Places</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourist/view-products">Products</Link>
        </div>
        <div className="nav-bar-link dropdown">
          <button className="dropbtn">Complaints </button>
          <div className="dropdown-content">
            <Link to={`/tourist/create-complaint`}>Create Complaint</Link>
            <Link to={`/tourist/view-Complaints`}>View Complaints</Link>

          </div>
        </div>

        <div className="nav-bar-link dropdown">
          <button className="dropbtn">Profile Management</button>
          <div className="dropdown-content">
            <Link to={`/tourist/profile`}>Profile</Link>
            <Link to="/">Log out</Link>

          </div>
        </div>

        <div className="nav-bar-link dropdown">
          <button className="dropbtn">Hotel & Flights </button>
          <div className="dropdown-content">
            <Link to="/hotel2" >Book Hotel</Link>
            <Link to="/tourist/search-flight" >Book Flights</Link>
            <Link to="">History</Link>

          </div>
        </div>

      </div>
    </nav >
  );
};

export default TouristNavBar;
