import React, { useEffect, useState } from "react";
import { getPendingDeletionRequests, approveDeletionRequest } from "../../api/AdminService";  

const DeletionRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getPendingDeletionRequests();
        setRequests(data.deletionRequests);  
      } catch (err) {
        setError("Failed to fetch deletion requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    console.log(requestId)
    try {
      const result = await approveDeletionRequest(requestId);   
      alert(result.message);  
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId)); 
    } catch (err) {
        console.error("Error in approving deletion request:", err);  
        alert("Failed to approve request.");
    }
  };

  if (loading) {
    return <p>Loading deletion requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <ul className="user-list">
        {requests.map((request) => (
          <li key={request._id} className="user-list-item">
            <div className="user-details">
                <span><strong>User: </strong>{request.user}</span>
                <span><strong>Role: </strong>{request.role}</span>
            </div>
            <button className="delete-button" onClick={() => handleApprove(request._id)}>Approve</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeletionRequestsList;
