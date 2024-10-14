import React from "react";
import { Link } from "react-router-dom";
import {advertiserID} from "../../IDs";


const AdvertiserNavBar = () => {
  return (
    <nav>
      <div class="nav-bar">
        <div class="nav-bar-link">
          <Link to="/advertiser">Home</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/create-advertiser">Create Profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to={`/advertiser/${advertiserID}`}>Profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/create-activity">Create Activity</Link>
        </div>
        <div class="nav-bar-link">
          <Link to={`/advertiser-activity/${advertiserID}`}>Activities</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/">Log out</Link>
        </div>
      </div>
    </nav>
  );
};

export default AdvertiserNavBar;
