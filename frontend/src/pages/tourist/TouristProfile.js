import React, { useEffect, useState } from "react";
import {
  getTouristInformation,
  updateTouristInformation,
} from "../../api/TouristService";
import TouristNavBar from "../../components/tourist/TouristNavBar";
import { useParams } from "react-router-dom";
import { nationalities } from "../../assets/Nationalities";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toastify

const TouristHomePage = () => {
  const { id } = useParams();
  const [profileInformation, setProfileInformation] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [editedProfile, setEditedProfile] = useState({
    email: "",
    nationality: "",
    job: "",
    mobileNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditClick = async () => {
    if (isEditing) {
      // Save and call the API
      setIsEditing(false);
      console.log("New value", editedProfile);
      try {
        const response = await updateTouristInformation(id, editedProfile);
        console.log("Profile updated successfully", response);
        toast.success("Profile updated successfully");
      } catch (error) {
        console.error("Failed to update user information:", error);
        toast.error("Error updating profile");
      }
    } else {
      // Clicking on edit
      setIsEditing(true);
      console.log("Editing mode enabled");
    }
  };

  const getUserInformation = async () => {
    try {
      const response = await getTouristInformation(id);
      setProfileInformation(response);
      setEditedProfile({
        email: response.email,
        nationality: response.nationality,
        job: response.job,
        mobileNumber: response.mobileNumber,
      });
    } catch (error) {
      console.error("Failed to fetch user information:", error);
    }
  };

  useEffect(() => {
    getUserInformation();
  });

  return (
    <div>
      <TouristNavBar />
      <h1>Your Profile</h1>
      <div>
        <ul className="tourist-profile">
          <li key={profileInformation._id}>
            <h2>
              <input
                type="text"
                name="userName"
                value={profileInformation.userName}
                readOnly={!isEditing} // Allow editing if in editing mode
              />
            </h2>
            <p>
              <b>Email:</b>
              <input
                type="text"
                name="email"
                value={editedProfile.email}
                onChange={handleInputChange} // Handle input changes
                readOnly={!isEditing}
              />
            </p>
            <p>
              <b>Date of birth:</b>
              <input
                type="text"
                name="dateOfBirth"
                value={new Date(
                  profileInformation.dateOfBirth
                ).toLocaleDateString()}
                readOnly
              />
            </p>
            <p>
              <b>Nationality:</b>
              {isEditing ? (
                <select
                  name="nationality"
                  value={editedProfile.nationality}
                  onChange={handleInputChange} // Handle changes
                >
                  {nationalities.map((nationality) => (
                    <option key={nationality} value={nationality}>
                      {nationality}
                    </option>
                  ))}
                </select>
              ) : (
                <input type="text" value={editedProfile.nationality} readOnly />
              )}
            </p>
            <p>
              <b>Job:</b>
              <input
                type="text"
                name="job"
                value={editedProfile.job}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </p>
            <p>
              <b>Mobile Number:</b>
              <input
                type="text"
                name="mobileNumber"
                value={editedProfile.mobileNumber}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </p>
            <p>
              <b>Balance:</b>
              {profileInformation.wallet ? (
                <input
                  type="text"
                  name="walletBalance"
                  value={
                    profileInformation.wallet.amount +
                    " " +
                    profileInformation.wallet.currency
                  }
                  readOnly
                />
              ) : (
                <span>No wallet information available</span>
              )}
            </p>
          </li>
        </ul>

        <button onClick={handleEditClick}>
          {isEditing ? "Save" : "Update"}
        </button>
      </div>

      {/* Toast container for displaying notifications */}
      <ToastContainer />
    </div>
  );
};

export default TouristHomePage;
