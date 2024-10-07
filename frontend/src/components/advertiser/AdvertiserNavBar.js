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
          <Link to={`/advertiser/6701cc555e553adca0a5c640`}>Profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/create-activity">Create Activity</Link>
        </div>
        <div class="nav-bar-link">
          <Link to={`/advertiser-activity/6701cc555e553adca0a5c640`}>Activities</Link>
        </div>

      </div>
    </nav>
  );
};

export default AdvertiserNavBar;
