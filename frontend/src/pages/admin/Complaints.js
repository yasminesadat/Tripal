import React, { useState, useEffect } from "react";
import AdminNavBar from "../../components/navbar/AdminNavBar";
import {createComplaint, getComplaintsByTourist,getAllComplaints,getComplaintById,updateComplaintStatus, replyToComplaint,} from "../../api/ComplaintsService";
import {adminID} from "../../IDs";


const ComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getAllComplaints();
                setComplaints(response);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        fetchComplaints();
    }, []);


    const handleReplyChange = (event) => {
        setReplyMessage(event.target.value);
    };

    const handleReplySubmit = async (event) => {
        event.preventDefault();
        
        if (!replyMessage) {
            alert("Please enter a reply message");
            return;
        }

        try {
            await replyToComplaint(selectedComplaint._id, {
                message: replyMessage,
                senderId: adminID,
            });

            // Re-fetch the complaints to get updated data
            const updatedComplaints = await getAllComplaints();
            setComplaints(updatedComplaints);
            setReplyMessage(""); 
            setSelectedComplaint(null); 
        } catch (error) {
            console.error("Error replying to complaint:", error);
        }
    };

    const handleStatusChange = async (complaintId, newStatus) => {
        try {
            await updateComplaintStatus(complaintId, { status: newStatus });
            // Update local state to reflect changes
            const updatedComplaints = complaints.map(complaint =>
                complaint._id === complaintId ? { ...complaint, status: newStatus } : complaint
            );
            setComplaints(updatedComplaints);
        } catch (error) {
            console.error("Error updating complaint status:", error);
        }
    };

    const viewComplaintDetails = async (complaintId) => {
        try {
            const complaintDetails = await getComplaintById(complaintId);
            setSelectedComplaint(complaintDetails);
        } catch (error) {
            console.error("Error fetching complaint details:", error);
        }
    };

    return (
        <div className="complaints">
          {/* <Sidebar setSideBarOpen={setSideBarOpen} /> */}
          <div className="dashboard__content">
            {/* <Header setSideBarOpen={setSideBarOpen} /> */}
            <div className="dashboard__content_content">
              <h1 className="text-30">Complaints Management</h1>
    
              <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 mt-60">
                <div className="overflowAuto">
                  <table className="tableTest mb-30">
                    <thead className="bg-light-1 rounded-12">
                      <tr>
                        <th>Complaint ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((complaint, i) => (
                        <tr key={i}>
                          <td>{complaint._id}</td>
                          <td>{complaint.title}</td>
                          <td>{complaint.status}</td>
                          <td>
                            <button onClick={() => viewComplaintDetails(complaint._id)}>View Details</button>
                            <button onClick={() => handleStatusChange(complaint._id, complaint.status === 'Pending' ? 'Resolved' : 'Pending')}>
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
    
              {/* Reply to Selected Complaint */}
              {selectedComplaint && (
                <div className="reply-section mt-30">
                  <h3>Reply to Complaint: {selectedComplaint.title}</h3>
                  <form onSubmit={handleReplySubmit}>
                    <textarea
                      value={replyMessage}
                      onChange={handleReplyChange}
                      placeholder="Enter your reply here..."
                    />
                    <button type="submit">Send Reply</button>
                  </form>
                </div>
              )}
    
              
            </div>
          </div>
        </div>
      );



}

export default ComplaintsPage;