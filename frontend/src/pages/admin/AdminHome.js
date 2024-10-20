import React from "react";
import AdminNavBar from "../../components/navbar/AdminNavBar";

const AdminHome = () => {
  return (
    <div>
      <AdminNavBar />
      <h1 style={{ fontSize: "48px", textAlign: "center", margin: "200px 0" }}>
        Admin
      </h1>
    </div>
  );
};

export default AdminHome;
