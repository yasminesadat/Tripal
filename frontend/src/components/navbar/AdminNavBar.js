import React from "react";
import { Link } from "react-router-dom";

const AdminNavBar = () => {
  return (
    <nav>
      <div className="nav-bar">
        <div className="nav-bar-link">
          <Link to="/admin">Home</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/activity-categories">Activity Categories</Link>
        </div>
        <div className="nav-bar-link dropdown">
          <button className="dropbtn">Upcoming Events</button>
          <div className="dropdown-content">
            <Link to="/admin/itineraries">Itineraries</Link>
            <Link to="/admin/activities">Activities</Link>
          </div>
        </div>

        <div class="nav-bar-link">
          <Link to="/preference-tags">Preference Tags</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/admin/view-products">Products</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/admin/new-admin">Add Admin</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/admin/new-governor">Add Governor</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/admin/delete-user">Delete User</Link>
        </div>
        <div className="nav-bar-link">
          <Link to="/admin/complaints">View Complaints</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/admin/changepassword">Change password</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/admin/requests">View Requests</Link>
        </div>
        <div class="nav-bar-link">
          <Link to="/">Log out</Link>
        </div>

      </div>

    </nav>
  );
};

export default AdminNavBar;