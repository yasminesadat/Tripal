import React from "react";
import { Link } from "react-router-dom";

const AdvertiserNavBar = () => {
  return (
    <nav>
      <div class="nav-bar">
        <div class="nav-bar-link">
          <Link to="/advertiser">Home</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/advertiser/:id">Profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/create-activity">Create Activity</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/advertiser-activity/:id">Activities</Link>
        </div>

      </div>
    </nav>
  );
};

export default AdvertiserNavBar;
