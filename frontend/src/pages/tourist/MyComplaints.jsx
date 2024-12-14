import React, { useState, useEffect } from "react";
import {
  getComplaintsByTourist,
  getComplaintById,
} from "../../api/ComplaintsService";
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@/api/UserService";
import Spinner from "@/components/common/Spinner";
import MetaComponent from "@/components/common/MetaComponent";
import ComplaintsForm from "./ComplaintsForm";
import { PlusOutlined } from "@ant-design/icons";
const metadata = {
  title: "Complaints || Tripal",
};
const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [userData, setUserData] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchUserData = async () => {
    try {
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  useEffect(() => {
    fetchUserData(); 
  }, []);
  const handleComplaintSubmit = (complaintData) => {
    setComplaints((prev) => [...prev, complaintData]);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getComplaintsByTourist();
        setComplaints(response); 
        const user = await getUserData();
        setUserData(user.data.id);
        setUserRole(user.data.role);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const toggleComplaintDetails = async (complaintId) => {
    try {
      const complaintDetails = await getComplaintById(complaintId);
      setSelectedComplaint(complaintDetails);
      navigate("/tourist/complaints-replies", {
        state: {
          complaint: complaintDetails,
          user: userData,
          role: userRole,
        },
      });
    } catch (error) {
      console.error("Error fetching complaint details:", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      <div>
        <TouristHeader />
        <main>
          <div className="complaints">
            <div className="dashboard__content">
              <div className="page-content-hana">
                <div className="dashboard__content_content">
                  <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 mt-60">
                    <h1 className="text-30">My Complaints</h1>
                    <button
                      className="add-complaint-btn"
                      onClick={() => setIsModalOpen(true)}
                      title="Add New Complaint"
                    >
                      <PlusOutlined />
                    </button>
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
                          {complaints.length === 0 ? (
                            <tr>
                              <td colSpan="6" style={{ textAlign: "center" }}>
                                No complaints were made.
                              </td>
                            </tr>
                          ) : (
                            complaints.map((complaint, i) => (
                              <React.Fragment key={complaint._id}>
                                <tr>
                                  <td>{complaint.title}</td>
                                  <td
                                    className={`circle ${
                                      complaint.status === "resolved"
                                        ? "text-green-2"
                                        : "text-red-2"
                                    }`}
                                  >
                                    {complaint.status}
                                  </td>
                                  <td>
                                    {new Date(
                                      complaint.date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </td>
                                  <td>
                                    <button
                                      className="custom-button"
                                      onClick={() =>
                                        toggleComplaintDetails(complaint._id)
                                      }
                                    >
                                      View Details
                                    </button>
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <FooterThree />
      </div>
      <ComplaintsForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmitSuccess={handleComplaintSubmit}
      />
      <style>{`
      
      .header-section {
                    margin-bottom: 20px;
                }

                .add-complaint-btn {
                    position: absolute;
                    top: 150px;
                    right: 150px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: var(--color-dark-purple);
                    border: none;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                .add-complaint-btn:hover {
                    background-color: var(--color-light-purple);
                    transform: scale(1.05);
                }

                .add-complaint-btn .anticon {
                    font-size: 20px;
                }

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
};

export default MyComplaints;
