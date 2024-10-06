import React from "react";
import { Link } from "react-router-dom";

const TourguideNavBar = () => {
  return (
    <nav>
      <div class="nav-bar">
        <div class="nav-bar-link">
          <Link to="/">Home</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourguide">New Itinerary</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourguide-itineraries">View my Itineraries</Link>
        </div>
      </div>
    </nav>
  );
};

export default TourguideNavBar;
