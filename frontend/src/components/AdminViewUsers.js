import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from "../api/AdminService"; // Assuming getUsers is an async function
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers(); // Fetch users from the API
        setUsers(response.users); // Assuming `response.users` contains the users array
        setInitLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setInitLoading(false);
      }
    };

    fetchData();
  }, []);

  const notifyDelete = (name) =>
    toast(`Activity Category ${name} is deleted successfully!`);

  const deleteUsers = async (id, name) => {
    try {
      await deleteUser(id);
      const updatedData = users.filter((item) => item._id !== id);
      setUsers(updatedData);
      notifyDelete(name);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      toast.error("Failed to delete activity category!");
    }
  };

//   // Function to delete a user
//   const deleteUser = async (userId) => {
//     try {
//       await axios.delete(`/admin/user/${userId}`); // Adjust the URL to match your delete endpoint
//       setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId)); // Update the local state to remove the deleted user
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

  if (initLoading) return <div>Loading...</div>; // Loading state

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <span>{user.userType}: {user.name} {/* Adjust the property names as necessary */}</span>
            <button onClick={() => deleteUsers(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default UserList;
