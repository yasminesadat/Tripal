import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from "../api/AdminService"; // Assuming getUsers is an async function
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import './UserList.css'; // Import a CSS file for styling

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers(); // Fetch users from the API
        setUsers(response.users); // Assuming `response.users` contains the users array
        setInitLoading(false);
        // toast.success("Users fetched successfully!"); // Notify success on user fetch
      } catch (error) {
        console.error("Error fetching users:", error);
        setInitLoading(false);
        toast.error("Failed to fetch users!"); // Notify error on user fetch
      }
    };

    fetchData();
  }, []);

  const deleteUsers = async (id) => {
    try {
      const response = await deleteUser(id);
      const message = response.message || "User deleted successfully"; 
      const updatedData = users.filter((item) => item._id !== id);
      setUsers(updatedData);
      toast.success(message); // Show success toast when a user is deleted
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      toast.error("Failed to delete user!"); // Show error toast if delete fails
    }
  };

  if (initLoading) return <div>Loading...</div>; // Loading state

  return (
    <div className="user-list-container">
      <h1 className="user-list-title">User List</h1>
      <ul className="user-list">
        {users.map(user => (
          <li key={user._id} className="user-list-item">
            <div className="user-details">
              <span><strong>ID:</strong> {user._id}</span>
              <span><strong>Type:</strong> {user.userType}</span>
            </div>
            <button className="delete-button" onClick={() => deleteUsers(user._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Toast container for showing notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default UserList;
