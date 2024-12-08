import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from "../../api/AdminService";
import {message} from "antd";
import Sidebar from '@/components/dasboard/Sidebar';
import Header from '@/components/dasboard/Header';
import Spinner from '../common/Spinner';
const UserListComponent = () => {
    const [users, setUsers] = useState([]);
    const [initLoading, setInitLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [notification, setNotification] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setInitLoading(true);
            try {
                const response = await getUsers();
                setUsers(response.users);
                setInitLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setInitLoading(false);
                message.error("Failed to fetch users!", "error");
            }
        };

        fetchData();
    }, []);

   

    const deleteUsers = async (name,id, role) => {
        try {
           
            await deleteUser(role, id);    
            const updatedData = users.filter((item) => item.userId !== id);
            setUsers(updatedData);
            message.success(`${name} deleted successfully`, "success");
        } catch (error) {
            console.error(`00Error deleting user with id ${ id }:`, error);
            message.error("Failed to delete user!", "error");
        }
        setDeleteConfirm(null);
    };

    const getRoleStyle = (role) => {
        const styles = {
            'Admin': { backgroundColor: '#fee2e2', color: '#991b1b' }, // Light red background, dark red text
            'Tourism Governor': { backgroundColor: '#e0e7ff', color: '#3730a3' }, // Light blue background, dark blue text
            'Tourist': { backgroundColor: '#dbeafe', color: '#1e40af' }, // Lighter blue background, navy text
            'Advertiser': { backgroundColor: '#fef3c7', color: '#92400e' }, // Light yellow background, amber text
            'Seller': { backgroundColor: '#f0fdfa', color: '#064e3b' }, // Mint green background, emerald text
            'Tour Guide': { backgroundColor: '#ede9fe', color: '#5b21b6' } // Lavender background, deep purple text
        };
        return styles[role] || { backgroundColor: '#f3f4f6', color: '#374151' };
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
                                    User Management
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
                                                <th style={{ padding: '0.75rem 1rem' }}>User ID</th>
                                                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user._id} style={{
                                                    borderBottom: '1px solid #e5e7eb',
                                                    '&:hover': { backgroundColor: '#f9fafb' }
                                                }}>
                                                    <td style={{ padding: '1rem' }}>{user.userName}</td>
                                                    <td style={{ padding: '1rem' }}>{user.userId}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '500',
                                                            ...getRoleStyle(user.role)
                                                        }}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                        {deleteConfirm === user.userId ? (
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                                <button
                                                                    onClick={() => deleteUsers(user.userName,user.userId, user.role)}
                                                                    style={{
                                                                        backgroundColor: '#dc2626',
                                                                        color: 'white',
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: '6px',
                                                                        border: 'none',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    Confirm
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(null)}
                                                                    style={{
                                                                        backgroundColor: '#e5e7eb',
                                                                        color: '#374151',
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: '6px',
                                                                        border: 'none',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setDeleteConfirm(user.userId)}
                                                                style={{
                                                                    backgroundColor: '#fee2e2',
                                                                    color: '#dc2626',
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: '6px',
                                                                    border: 'none',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
        </>
    );
};

export default UserListComponent;