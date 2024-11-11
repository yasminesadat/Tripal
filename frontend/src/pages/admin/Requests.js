import React, { useState, useEffect } from "react";
import AdminNavBar from "../../components/navbar/AdminNavBar";
import { getRequests, SetRequestStatus, getRequest } from "../../api/RequestService";
import { adminId } from "../../IDs";
import "../../css/custom.css";
import "../../css/main.css";
import "../../css/vendors.css";
import { message, Modal, Button } from 'antd';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getRequests();
                setRequests(response);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };

        fetchRequests();
    }, []);

    const acceptSelectedRequest = async (id) => {
        try {
            await SetRequestStatus(id, "accepted");

            const newData = requests.map((c) => {
                if (c._id === id) {
                    c.status = "accepted";
                    return c;
                } else {
                    return c;
                }
            });
            setRequests(newData);
            message.success("Request accepted!");
        } catch (error) {
            message.error("Failed to accept request!");
        }
    };

    const rejectSelectedRequest = async (id) => {
        try {
            await SetRequestStatus(id, "rejected");

            const newData = requests.map((c) => {
                if (c._id === id) {
                    c.status = "rejected";
                    return c;
                } else {
                    return c;
                }
            });
            setRequests(newData);
            message.success("Request rejected!");
        } catch (error) {
            message.error("Failed to reject request!");
        }
    };

    const viewDocument = async (id) => {
        try {
            const response = await getRequest(id);
            const documentUrl = response.document;

            setSelectedDocument(documentUrl);
            if (!documentUrl) {
                message.success("No document uploaded!");
            } else {
                setIsModalVisible(true); // Show the modal when a document is loaded
                message.success("Document loaded successfully!");
            }
        } catch (error) {
            message.error("Failed to load document!");
            console.error("Error loading document:", error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Close the modal
    };

    return (
        <div className="complaints">
            <AdminNavBar />
            <div className="dashboard__content">
                <div className="dashboard__content_content">
                    <h1 className="text-30">Requests Management</h1>

                    <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 mt-60">
                        <div className="overflowAuto">
                            <table className="tableTest mb-30">
                                <thead className="bg-light-1 rounded-12">
                                    <tr>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => (
                                        <React.Fragment key={request._id}>
                                            <tr>
                                                <td>{request.userName}</td>
                                                <td>{request.role}</td>
                                                <td className={`circle ${request.status === 'accepted' ? 'text-green-2' : request.status === 'pending' ? 'text-blue-1' : 'text-red-2'}`}>
                                                    {request.status}
                                                </td>
                                                <td>{new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                <td>
                                                    <button onClick={() => viewDocument(request._id)}>
                                                        View Document
                                                    </button>
                                                    <button onClick={() => acceptSelectedRequest(request._id)}>
                                                        Accept
                                                    </button>
                                                    <button onClick={() => rejectSelectedRequest(request._id)}>
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal for Document Viewer */}
                    <Modal
                        title="Document Viewer"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="cancel" onClick={handleCancel}>
                                Cancel
                            </Button>,
                        ]}
                    >
                        {selectedDocument && (
                            <iframe
                                src={selectedDocument}
                                title="Document Viewer"
                                width="100%"
                                height="500px"
                                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                            ></iframe>
                        )}
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Requests;
