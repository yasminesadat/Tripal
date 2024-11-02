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
        {/* <div class="nav-bar-link">
          <Link to="/tourist-profile">Profile</Link>
        </div> */}
        <div class="nav-bar-link">
          <Link to={`/tourist-profile/${touristId}`}>Profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/upcoming-activities">Activities</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/itineraries">Itineraries</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/historical-places">Historical Places</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourist/view-products">Products</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/">Log out</Link>
        </div>
      </div>
    </nav>
  );
};

export default TouristNavBar;
