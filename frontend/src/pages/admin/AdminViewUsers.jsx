import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from "../../api/AdminService";
import {message} from 'antd';
import Sidebar from '@/components/dasboard/Sidebar';
import Header from '@/components/dasboard/Header';
import UserListComponent from '@/components/dasboard/ViewUsers';
const UserList = () => {
    const [users, setUsers] = useState([]);
    const [initLoading, setInitLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [notification, ] = useState(null);
    const [sideBarOpen, setSideBarOpen] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUsers();
                setUsers(response.users);
                setInitLoading(false);
            } catch (error) {
                const key = 'updatable';
                console.error("Error fetching users:", error);
                setInitLoading(false);
                message.error({ content: 'Failed to fetch users', key });
                setTimeout(() => {
                message.destroy(key); // Destroy the message after timeout
                }, 2500);
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
            const key3="updated3"
           // message.success(`${name} deleted successfully`, "success");
            message.success({ content: `${name} deleted successfully`, key3 });

            // Set timeout to close the message after 3 seconds (3000 ms)
            setTimeout(() => {
            message.destroy(key3); // Destroy the message after timeout
            }, 2500);
        } catch (error) {
            console.error(`00Error deleting user with id ${ id }:`, error);
            const key2 = 'updatable2';
            message.error({ content: 'Failed to delete user!', key2 });
            // Set timeout to close the message after 3 seconds (3000 ms)
            setTimeout(() => {
            message.destroy(key2); // Destroy the message after timeout
            }, 2500);


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
                Loading...
            </div>
        );
    }

    return (
        <>
            <div
                className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""
                    } js-dashboard`}
            >
                <Sidebar setSideBarOpen={setSideBarOpen} />

                <div className="dashboard__content">
                    <Header setSideBarOpen={setSideBarOpen} />
                    

<UserListComponent/>


                    <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}
            </div>
                </div>
            </div>
        </>
    );
};

export default UserList;