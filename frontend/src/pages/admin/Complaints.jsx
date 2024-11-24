import React, { useState, useEffect } from "react";
// import AdminNavBar from "../../components/navbar/AdminNavBar";
import { getAllComplaints, getComplaintById, updateComplaintStatus, replyToComplaint, } from "../../api/ComplaintsService";
import { OrderedListOutlined } from '@ant-design/icons';
import { checkTouristExists } from "../../api/TouristService";
import { message, Dropdown, Menu } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import { getUserData } from "@/api/UserService";
import Spinner from "@/components/common/Spinner";
const ComplaintsPage = () => {
    const tabs = ["All", "Pending", "Resolved"];
    const navigate = useNavigate();
    // const [sideBarOpen, setSideBarOpen] = useState(true);
    const [currentTab, setcurrentTab] = useState("All");
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [isSorted, setIsSorted] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [userData, setUserData] = useState("");
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const fetchUserExistence = async () => {
            if (selectedComplaint != null) {
                if (selectedComplaint.issuerId) {
                    const exists = await checkUserExistence(selectedComplaint.issuerId);
                    setUserExists(exists);
                }
            }
        };

        fetchUserExistence();
    }, [selectedComplaint?.issuerId]);
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getAllComplaints();
                const shuffledArray = response.sort(() => Math.random() - 0.5);
                setComplaints(shuffledArray);
                const user = await getUserData();
                setUserData(user.data.id); // Update state
                setUserRole(user.data.role);

                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error("Error fetching complaints:", error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchComplaints();
    }, []);



    const checkUserExistence = async (id) => {
        console.log("The id is ", id);
        try {
            const response = await checkTouristExists(id);
            console.log("msg", response.message);
            if (response.message === "User exists") {

                return true;

            }
            else
                if (response.message === "User not found") {
                    return false;
                }
        }
        catch (error) {
            message.error(error);
        }
    };



    useEffect(() => {
        // Set newStatus to the current status of selectedComplaint
        if (selectedComplaint) {
            setNewStatus(selectedComplaint.status);
        }
    }, [selectedComplaint]);

    const handleStatusChange = async (complaintId) => {
        try {
            //console.log(newStatus)
            //console.log(complaintId)
            await updateComplaintStatus(complaintId, { status: "resolved" });
            // Update local state to reflect changes
            const updatedComplaints = complaints.map(complaint =>
                complaint._id === complaintId ? { ...complaint, status: "resolved" } : complaint
            );
            setComplaints(updatedComplaints);
            setSelectedComplaint((prev) => ({ ...prev, status: newStatus }));
            message.success("Complaint resolved successfully!");
        } catch (error) {
            message.error("Error updating complaint status");
            console.error("Error updating complaint status:", error);
        }
    };

    const toggleComplaintDetails = async (complaintId) => {

        // Otherwise, fetch and show the complaint details
        try {
            const complaintDetails = await getComplaintById(complaintId);
            setSelectedComplaint(complaintDetails);
            navigate("/admin/complaints/replies", {
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


    const items = [
        {
            key: '1',
            label: (
                <a onClick={() => {
                    setIsSorted(true);
                }}>
                    Ascending
                </a>
            ),
        }, {
            key: '2',
            label: (
                <a onClick={() => {
                    setIsSorted(false);
                }}>
                    Descending
                </a>
            ),

        }];
    if (loading) {

        return <Spinner />; // Show the spinner while loading
    }
    return (
        <>
            <div className="complaints">
                {/* <AdminNavBar /> */}
                {/* <Sidebar setSideBarOpen={setSideBarOpen} /> */}
                <div className="dashboard__content">
                    {/* <Header setSideBarOpen={setSideBarOpen} /> */}
                    <div className="dashboard__content_content">
                        <h1 className="text-30">Complaints Management</h1>
                        <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20 mt-60">
                            <div className="tabs -underline-2 js-tabs">
                                <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">

                                    {tabs.map((tab, i) => (
                                        <div
                                            key={i}
                                            className="col-auto"
                                            onClick={() => setcurrentTab(tab)}
                                        >
                                            <button
                                                className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${tab === currentTab ? "is-tab-el-active" : ""
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="tabs__content js-tabs-content">
                                    <div className="tabs__pane -tab-item-1 is-tab-el-active">
                                        <div className="overflowAuto">
                                            <table className="tableTest mb-30">
                                                <thead className="bg-light-1 rounded-12">
                                                    <tr>
                                                        <th>Complaint ID</th>
                                                        <th>Title</th>
                                                        <th>Status</th>
                                                        <th>Date     <Dropdown menu={{ items }} placement="bottom" arrow={{ pointAtCenter: true }}>
                                                            <OrderedListOutlined style={{ cursor: 'pointer', fontSize: '24px' }} />
                                                        </Dropdown></th>
                                                        <th>Actions</th>
                                                    </tr>

                                                </thead>

                                                <tbody>
                                                    {
                                                        (isSorted
                                                            ? [...complaints].sort((a, b) => new Date(a.date) - new Date(b.date))
                                                            : complaints.sort((a, b) => new Date(b.date) - new Date(a.date))
                                                        )
                                                            .filter((complaint) =>
                                                                currentTab === "All" || complaint.status.toLowerCase() === currentTab.toLowerCase()
                                                            )


                                                            .map((complaint) => (
                                                                <React.Fragment key={complaint._id}>
                                                                    <tr>
                                                                        <td>#{complaint._id.slice(-3)}</td>

                                                                        <td>{complaint.title}</td>
                                                                        <td className={`circle ${complaint.status === 'resolved' ? 'text-green-2' : 'text-red-2'}`}>
                                                                            {complaint.status}
                                                                        </td><td>{(new Date(complaint.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}</td>
                                                                        <td>
                                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                                <button className="custom-button" onClick={() => toggleComplaintDetails(complaint._id)}>
                                                                                    View Details
                                                                                </button>
                                                                                <button className="custom-button-green" onClick={() => handleStatusChange(complaint._id)}>
                                                                                    Resolve
                                                                                </button>
                                                                            </div>
                                                                        </td>

                                                                    </tr>


                                                                </React.Fragment>
                                                            ))}

                                                    {/* <td>
                                <div className="d-flex items-center">
                                  <button className="button -dark-1 size-35 bg-light-1 rounded-full flex-center">
                                    <i className="icon-pencil text-14"></i>
                                  </button>

                                  <button className="button -dark-1 size-35 bg-light-1 rounded-full flex-center ml-10">
                                    <i className="icon-delete text-14"></i>
                                  </button>
                                </div>
                              </td> */}

                                                </tbody>
                                            </table>
                                        </div>

                                        {/* <Pagination /> */}

                                        {/* <div className="text-14 text-center mt-20">
                    Showing results 1-30 of 1,415
                  </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="text-center pt-30">
            © Copyright Viatours {new Date().getFullYear()}
          </div> */}
                    </div>
                </div>
            </div>
            <style>{`
      
      
      .custom-button {
   background-color: var(--color-dark-purple) !important;
   border: 2px solid var(--color-dark-purple) !important;
   color: #fff !important; /* Text color */
   border-radius: 20px; /* Slightly smaller rounded edges */
   padding: 8px 16px; /* Reduced padding */
   font-size: 12px; /* Adjusted font size */
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
 .custom-button-green {
  background-color: var(--color-stone) !important;
   border: 2px solid var(--color-stone) !important;
   color: #fff !important; /* Text color */
   border-radius: 20px; /* Slightly smaller rounded edges */
   padding: 8px 16px; /* Reduced padding */
   font-size: 12px; /* Adjusted font size */
   font-weight: 500; /* Medium font weight */
   cursor: pointer; /* Pointer cursor on hover */
   transition: all 0.3s ease; /* Smooth transitions */
   box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.custom-button-green:hover,
.custom-button-green:focus {
  background-color: var(--color-stone-light) !important;
  border-color: var(--color-stone-light) !important;
}
 
 
      
    
     `}</style>
        </>
    );
}
export default ComplaintsPage;