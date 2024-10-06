import React from "react";
import { Link } from "react-router-dom";

const AdminNavBar = () => {
  return (
    <nav>
      <div class="nav-bar">
        <div class="nav-bar-link">
          <Link to="/seller">Home</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/create-product">Activity Categories</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/view-products">Preference Tags</Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
