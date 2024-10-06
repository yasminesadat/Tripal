import React from "react";
import { Link } from "react-router-dom";

const GuestNavBar = () => {
  return (
    <nav>
      <div class="nav-bar">
        <div class="nav-bar-link">
          <Link to="/">Home</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/admin">Admin</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/advertiser">Advertiser</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/seller">Seller</Link>  
        </div>
        <div class="nav-bar-link">
          <Link to="/tourist">Tourist</Link>  
        </div>
        <div class="nav-bar-link">
          <Link to="/tourguide">Tourguide</Link>  
        </div>
        <div class="nav-bar-link">
          <Link to="/governor">Governor</Link>  
        </div>
        <div class="nav-bar-link">
        <Link to="/create-historicalPlace">Historical Places</Link>  
        </div>
        <div class="nav-bar-link">
          <Link to="/adminDeleteUser">View User</Link>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavBar;
