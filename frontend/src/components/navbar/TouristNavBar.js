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
        <div class="nav-bar-link">
          <Link to={`/tourist-profile/${touristId}`}>Profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/upcoming-activities">Upcoming Activities</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/upcoming-itineraries">Upcoming Itineraries</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/paid-activities">Paid Activities</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/paid-itineraries">Paid Itineraries</Link>
          <Link to="/itineraries">view All Itineraries</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/itineraries/booked-itineraries">View Booked Itineraries </Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/historical-places">Historical Places</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourist/view-products">Products</Link>
        </div>
        <div class="nav-bar-link">
          <Link to={`/tourist/create-complaint/${touristId}`}>Complaint</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/">Log out</Link>
        </div>
      </div>
    </nav >
  );
};

export default TouristNavBar;
