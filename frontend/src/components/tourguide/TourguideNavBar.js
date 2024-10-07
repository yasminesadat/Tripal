import React from "react";
import { Link } from "react-router-dom";

const TourguideNavBar = () => {
  return (
    <nav>
      <div class="nav-bar">
        <div class="nav-bar-link">
          <Link to="/tourguide/create">Create Profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourguide/update/66fe7f31f4fd7897ac7fbc16">Update Profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourguide">Home</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourguide/66fe7f31f4fd7897ac7fbc16">View profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/create-itinerary">New Itinerary</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/tourguide-itineraries">My Itineraries</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/">Log out</Link>
        </div>

      </div>
    </nav>
  );
};

export default TourguideNavBar;
