import React from "react";
import { Link } from "react-router-dom";
import { tourGuideID } from "../../IDs";
const TourguideNavBar = () => {
  return (
    <nav>
      <div className="nav-bar">
        {/* <div className="nav-bar-link">
          <Link to="/tourguide/create">Create Profile</Link>
        </div> */}
        <div className="nav-bar-link">
          <Link to={`/tourguide/update`}>Update Profile</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/tourguide">Home</Link>
        </div>
        <div className="nav-bar-link">
          <Link to={`/tourguide/profile`}>View profile</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/create-itinerary">New Itinerary</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/tourguide-itineraries">My Itineraries</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/">Log out</Link>
        </div>
      </div>
    </nav>
  );
};

export default TourguideNavBar;
