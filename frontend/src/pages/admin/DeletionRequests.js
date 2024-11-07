import React from "react";
import DeletionRequestsList from "../../components/requests/DeletionRequestsList";  
import AdminNavBar from "../../components/navbar/AdminNavBar"

const DeletionRequests = () => {
  return (
    <div>
        <AdminNavBar />
        <h2 className="user-list-title">Pending Deletion Requests</h2>
        <DeletionRequestsList />
    </div>
  );
};

export default DeletionRequests;