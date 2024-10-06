import React from "react";
import { Link } from "react-router-dom";

const SellerNavBar = () => {
  return (
    <nav>
      <div class="seller-nav-bar">
        <div class="nav-bar-link">
          <Link to="/seller">Home</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/create-product">Create Product</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/view-products">Products List</Link>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavBar;
