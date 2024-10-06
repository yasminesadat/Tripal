import React from "react";
import { Link } from "react-router-dom";

const TouristNavBar = () => {
  return (
    <nav>
      <div class="nav-bar">
        <div class="nav-bar-link">
          <Link to="/tourist">Home</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourist-profile">Profile</Link>
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
      </div>
    </nav>
  );
};

export default TouristNavBar;
