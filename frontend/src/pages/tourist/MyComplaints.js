import React, { useState, useEffect } from "react";
import { getComplaintsByTourist,getComplaintById,replyToComplaint } from "../../api/ComplaintsService";
import { touristId } from "../../IDs";
import { useParams } from "react-router-dom";
import TouristNavBar from "../../components/navbar/TouristNavBar"


const MyComplaints = () => {
    const { id } = useParams();
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                console.log(id)
                const response = await getComplaintsByTourist(id);
                setComplaints(response);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        fetchComplaints();
    }, [id]);


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
            const updatedComplaints = await getComplaintsByTourist(id);
            setComplaints(updatedComplaints);
            //setReplyMessage(""); 
            //setSelectedComplaint(null); 
        } catch (error) {
            console.error("Error replying to complaint:", error);
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
        <div className="complaints">
            <TouristNavBar />
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
                                                    <button onClick={() => toggleComplaintDetails(complaint._id)}>
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
                                                                    <li class="text-14 bg-light-1 rounded-12 py-20 px-30 mt-15" key={index}>{reply.message} (from: {reply.senderId}) on {new Date(reply.date).toLocaleDateString()}</li>
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
        </div>
    );



}

export default MyComplaints;