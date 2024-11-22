import React, { useState, useEffect } from "react";
import { getComplaintsByTourist, getComplaintById, replyToComplaint } from "../../api/ComplaintsService"
// import TouristNavBar from "../../components/navbar/TouristNavBar"
import FooterThree from "@/components/layout/footers/FooterThree";
import { message } from "antd";
const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getComplaintsByTourist();
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
            //console.log(replyMessage)
            await replyToComplaint(selectedComplaint._id, {
                message: replyMessage,
                senderId: id,
            });
            // Re-fetch the complaints to get updated data
            const updatedComplaints = await getComplaintsByTourist();
            setComplaints(updatedComplaints);
            const updatedComplaintDetails = await getComplaintById(selectedComplaint._id);
            setSelectedComplaint(updatedComplaintDetails);

            setReplyMessage("");
            //setSelectedComplaint(null); 
            message.success("Reply sent successfully!");
        } catch (error) {
            console.error("Error replying to complaint:", error);
            message.error("Failed to send reply. Please try again.");
        }
    };


    const toggleComplaintDetails = async (complaintId) => {
        if (selectedComplaint && selectedComplaint._id === complaintId) {
            // If the same complaint is selected, hide it
            setSelectedComplaint(null);
        } else {
            // Otherwise, fetch and show the complaint details
            try {
                const complaintDetails = await getComplaintById(complaintId);
                setSelectedComplaint(complaintDetails);
            } catch (error) {
                console.error("Error fetching complaint details:", error);
            }
        }
    };

    return (
        <>
            <div className="complaints">
                {/* <TouristNavBar /> */}
                {/* <Sidebar setSideBarOpen={setSideBarOpen} /> */}
                <div className="dashboard__content">
                    {/* <Header setSideBarOpen={setSideBarOpen} /> */}
                    <div className="dashboard__content_content">
                        <h1 className="text-30">My Complaints</h1>

                        <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 mt-60">
                            <div className="overflowAuto">
                                <table className="tableTest mb-30">
                                    <thead className="bg-light-1 rounded-12">
                                        <tr>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.map((complaint, i) => (
                                            <React.Fragment key={complaint._id}>
                                                <tr>
                                                    <td>{complaint.title}</td>
                                                    <td className={`circle ${complaint.status === 'resolved' ? 'text-purple-1' : 'text-red-2'}`}>
                                                        {complaint.status}
                                                    </td>
                                                    <td>{(new Date(complaint.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}</td>
                                                    <td>
                                                        <button className="custom-button" onClick={() => toggleComplaintDetails(complaint._id)}>
                                                            {selectedComplaint && selectedComplaint._id === complaint._id ? 'Hide Details' : 'View Details'}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {selectedComplaint && selectedComplaint._id === complaint._id && (
                                                    <tr>
                                                        <td colSpan="4">
                                                            <div className="complaint-details">
                                                                <h3>Complaint Details</h3>
                                                                <p><strong>Title:</strong> {selectedComplaint.title}</p>
                                                                <p><strong>Body:</strong> {selectedComplaint.body}</p>
                                                                <p><strong>Date:</strong> {(new Date(selectedComplaint.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}</p>
                                                                <p><strong>Status:</strong> {selectedComplaint.status}</p>
                                                                <h4>Replies</h4>
                                                                <ul>
                                                                    {selectedComplaint.replies.map((reply, index) => (
                                                                        <li className="text-14 bg-light-1 rounded-12 py-20 px-30 mt-15" key={index}>{reply.message} (from: {reply.senderId}) on {new Intl.DateTimeFormat('en-US', {
                                                                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
                                                                        }).format(new Date(reply.date))}</li>
                                                                    ))}
                                                                </ul>

                                                                {/* Reply Form */}
                                                                <div className="reply-section">
                                                                    <h4>Reply to Complaint</h4>
                                                                    <form onSubmit={handleReplySubmit}>
                                                                        <textarea
                                                                            value={replyMessage}
                                                                            onChange={handleReplyChange}
                                                                            placeholder="Enter your reply here..."
                                                                            required
                                                                        />
                                                                        <button type="submit">Send Reply</button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterThree />
            </div>
            <style>{`
      
     .custom-button {
  background-color: var(--color-dark-purple) !important;
  border: 2px solid var(--color-dark-purple) !important;
  color: #fff !important; /* Text color */
  border-radius: 20px; /* Slightly smaller rounded edges */
  padding: 8px 16px; /* Reduced padding */
  font-size: 14px; /* Adjusted font size */
  font-weight: 500; /* Medium font weight */
  cursor: pointer; /* Pointer cursor on hover */
  transition: all 0.3s ease; /* Smooth transitions */
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.custom-button:hover,
.custom-button:focus {
  background-color: var(--color-light-purple) !important;
  border-color: var(--color-light-purple) !important;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow on hover */
}

.custom-button:active {
  transform: scale(0.98); /* Slightly shrink the button on click */
}

.custom-button:disabled {
  background-color: #ccc !important;
  border-color: #ccc !important;
  color: #666 !important;
  cursor: not-allowed;
  box-shadow: none;
}



     
   
    `}</style>
        </>
    );



}

export default MyComplaints;