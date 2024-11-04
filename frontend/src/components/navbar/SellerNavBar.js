import React from "react";
import { Link } from "react-router-dom";

const SellerNavBar = () => {
  return (
    <nav>
      <div class="nav-bar">
        <div class="nav-bar-link">
          <Link to="/seller">Home</Link>
        </div>
        {/* <div class="nav-bar-link">
          <Link to="/create-seller">Create Profile</Link>
        </div> */}
        <div class="nav-bar-link">
          <Link to="/seller/profile">Edit Profile</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/seller/create-product">Create Product</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/seller/view-products">View All Products</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/">Log out</Link>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavBar;
