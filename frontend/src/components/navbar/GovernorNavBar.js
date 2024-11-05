import React from "react";
import { Link } from "react-router-dom";

const GovernorNavBar = () => {
  return (
    <nav>
      <div className="nav-bar">
        <div className="nav-bar-link">
          <Link to="/governor">Home</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/historicalPlace">Add Historical Place</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/historicalPlace/tourismGoverner">Historical Places</Link>
        </div>
        {/* <div class="nav-bar-link">
          <Link to="/create-tags">Create Tags</Link>
        </div> */}
        <div className="nav-bar-link">
          <Link to="/">Log out</Link>
        </div>
      </div>
    </nav>
  );
};

export default GovernorNavBar;
