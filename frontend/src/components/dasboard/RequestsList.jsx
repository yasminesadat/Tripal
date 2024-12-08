import  { useState, useEffect } from "react";
import { getRequests, SetRequestStatus, getRequest } from "../../api/RequestService";
import {  Modal } from 'antd';
import Spinner from "../common/Spinner";
const RequestsList = () => {
    const [requests, setRequests] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [actionConfirm, setActionConfirm] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getRequests();
                setRequests(response);
                setInitLoading(false);
            } catch (error) {
                console.error("Error fetching requests:", error);
                setInitLoading(false);
                showNotification("Failed to fetch requests!", "error");
            }
        };

        fetchRequests();
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const getStatusStyle = (status) => {
        const styles = {
            'accepted': { backgroundColor: '#dcfce7', color: '#166534' },
            'pending': { backgroundColor: '#fef3c7', color: '#92400e' },
            'rejected': { backgroundColor: '#fee2e2', color: '#991b1b' }
        };

        return styles[status] || { backgroundColor: '#f3f4f6', color: '#374151' };
    };

    const handleRequestAction = async (id, action) => {
        try {
            await SetRequestStatus(id, action);

            const newData = requests.map((c) => {
                if (c._id === id) {
                    c.status = action;
                    return c;
                } else {
                    return c;
                }
            });
            setRequests(newData);
            showNotification(`Request ${action} successfully!`, "success");
            setActionConfirm(null);
        } catch (error) {
            showNotification(`Failed to ${action} request!`, "error");
        }
    };

    const viewDocument = async (id) => {
        try {
            const response = await getRequest(id);
            const documentUrl = response.document;

            if (!documentUrl) {
                showNotification("No document uploaded!", "error");
                return;
            }

            setSelectedDocument(documentUrl);
            setIsModalVisible(true);
        } catch (error) {
            showNotification("Failed to load document!", "error");
            console.error("Error loading document:", error);
        }
    };

    if (initLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: '#6b7280'
            }}>
               <Spinner/>
            </div>
        );
    }

    return (
        <>
            
                    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                padding: '1.5rem'
                            }}>
                                <h1 style={{
                                    fontSize: '1.875rem',
                                    fontWeight: '600',
                                    color: '#111827',
                                    marginBottom: '1rem'
                                }}>
                                    Requests Management
                                </h1>

                                {notification && (
                                    <div style={{
                                        padding: '1rem',
                                        borderRadius: '6px',
                                        marginBottom: '1rem',
                                        backgroundColor: notification.type === 'error' ? '#fee2e2' : '#dcfce7',
                                        color: notification.type === 'error' ? '#991b1b' : '#166534'
                                    }}>
                                        {notification.message}
                                    </div>
                                )}

                                <div style={{
                                    overflowX: 'auto',
                                    marginTop: '1rem'
                                }}>
                                    <table style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        textAlign: 'left'
                                    }}>
                                        <thead>
                                            <tr style={{
                                                borderBottom: '1px solid #e5e7eb',
                                                backgroundColor: '#f9fafb'
                                            }}>
                                                <th style={{ padding: '0.75rem 1rem' }}>Username</th>
                                                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                                                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                                                <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map((request) => (
                                                <tr key={request._id} style={{
                                                    borderBottom: '1px solid #e5e7eb',
                                                    '&:hover': { backgroundColor: '#f9fafb' }
                                                }}>
                                                    <td style={{ padding: '1rem' }}>{request.userName}</td>
                                                    <td style={{ padding: '1rem' }}>{request.role}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '500',
                                                            ...getStatusStyle(request.status)
                                                        }}>
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>

                                                            {request.status === 'pending' &&
                                                                <button
                                                                    onClick={() => handleRequestAction(request._id, 'accepted')}
                                                                    style={{
                                                                        backgroundColor: '#dcfce7',
                                                                        color: '#166534',
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: '6px',
                                                                        border: 'none',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    Accept
                                                                </button>
                                                            }
                                                            {request.status === 'pending' &&
                                                                <button
                                                                    onClick={() => handleRequestAction(request._id, 'rejected')}
                                                                    style={{
                                                                        backgroundColor: '#fee2e2',
                                                                        color: '#991b1b',
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: '6px',
                                                                        border: 'none',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    Reject
                                                                </button>

                                                            }
                                                            <button
                                                                onClick={() => viewDocument(request._id)}
                                                                style={{
                                                                    backgroundColor: '#e0e7ff',
                                                                    color: '#3730a3',
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: '6px',
                                                                    border: 'none',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                View Document
                                                            </button>

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                   

            <Modal
                title="Document Viewer"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <button key="cancel" onClick={() => setIsModalVisible(false)} style={{
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        Cancel
                    </button>,
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
        </>
    );
};

export default RequestsList;