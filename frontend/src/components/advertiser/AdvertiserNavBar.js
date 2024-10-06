import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav>
      <div class="advertiser-nav-bar">
        <div class="nav-bar-link">
          <Link to="/advertiser-home">Home</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/preference-tags">Manage Preference Tags</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/view-products">View Products</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/upcoming-activities">View Upcoming Activities</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/historical-places">View Historical Places</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/itineraries">View Itineraries</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/adminActivityCategories">Activity Categories</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tour-guide-itineraries">Itineraries</Link>
      </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
