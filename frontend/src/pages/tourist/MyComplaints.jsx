import React, { useState, useEffect } from "react";
import { getComplaintsByTourist, getComplaintById, replyToComplaint } from "../../api/ComplaintsService"
// import TouristNavBar from "../../components/navbar/TouristNavBar"
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@/api/UserService";
import Spinner from "@/components/common/Spinner";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
    title: "Complaints || Tripal",
};
const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [userData, setUserData] = useState("");
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(true); // Track loading state

    const fetchUserData = async () => {
        try {

        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    };

    useEffect(() => {
        console.log("Im rendering this page");

        fetchUserData(); // Invoke the renamed function
        // Log userData when it changes
    }, []);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getComplaintsByTourist();
                setComplaints(response); // Set complaints data

                const user = await getUserData();
                console.log("data is ", user.data);
                setUserData(user.data.id); // Update user data state
                setUserRole(user.data.role); // Update user role state
                console.log("id is ", user.data.id); // Log user ID directly
            } catch (error) {
                console.error("Error fetching complaints:", error);
            } finally {
                setLoading(false); // Set loading to false once the async operation is finished
            }
        };

        fetchComplaints();
    }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount





    const toggleComplaintDetails = async (complaintId) => {

        // Otherwise, fetch and show the complaint details
        try {
            const complaintDetails = await getComplaintById(complaintId);
            setSelectedComplaint(complaintDetails);
            console.log("selected is", complaintDetails);
            navigate("/tourist/complaints-replies", {
                state: {
                    complaint: complaintDetails,
                    user: userData,
                    role: userRole
                }
            });

        } catch (error) {
            console.error("Error fetching complaint details:", error);
        }

    };

    if (loading) {
        return <Spinner />; // Show the spinner while loading
    }

    return (
        <>

            <MetaComponent meta={metadata} />
            <div className="page-wrapper">
                <TouristHeader />
                <main className="page-content">



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
                                                            <td className={`circle ${complaint.status === 'resolved' ? 'text-green-2' : 'text-red-2'}`}>
                                                                {complaint.status}
                                                            </td>
                                                            <td>{(new Date(complaint.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}</td>
                                                            <td>
                                                                <button className="custom-button" onClick={() => toggleComplaintDetails(complaint._id)}>
                                                                    View Details
                                                                </button>
                                                            </td>
                                                        </tr>

                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
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