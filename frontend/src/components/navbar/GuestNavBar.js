import React from "react";
import { Link } from "react-router-dom";
//that's temporary; only activities-itineraries-places should appear
const GuestNavBar = () => {
  return (
    <nav>
      <div className="nav-bar">
        <div className="nav-bar-link">
          <Link to="/">Home</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/admin">Admin</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/advertiser">Advertiser</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/seller">Seller</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/tourist">Tourist</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/tourguide">Tourguide</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/governor">Governor</Link>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavBar;
