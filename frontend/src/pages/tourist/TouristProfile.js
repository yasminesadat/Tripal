import React, { useEffect, useState } from "react";
import { getTouristInformation, updateTouristInformation } from "../../api/TouristService";
import TouristNavBar from "../../components/tourist/TouristNavBar";
import { useParams } from "react-router-dom";
import { nationalities } from "../../assets/Nationalities";

const TouristHomePage = () => {
  const { id } = useParams();
  const [profileInformation, setProfileInformation] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", isSuccess: false });

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
    if (isEditing) {  // i want to save and call the api 

      setIsEditing(false);
      console.log("New value", editedProfile);
      try {
        const response = await updateTouristInformation(id, editedProfile);
        console.log("Profile updated successfully", response);
        setFeedback({ message: "Profile updated successfully!", isSuccess: true });
      } catch (error) {
        console.error("Failed to update user information:", error);
        setFeedback({ message: "Error updating profile", isSuccess: false });
      }
    } else { // im clicking on edit 
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
  }, []);

  const FeedbackMessage = ({ message, isSuccess }) => {
    const feedbackStyle = {
      color: isSuccess ? "green" : "red",
      margin: "10px 0",
      fontWeight: "bold",
    };

    return (
      <div style={feedbackStyle}>
        {message}
      </div>
    );
  };

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
                value={new Date(profileInformation.dateOfBirth).toLocaleDateString()}
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
                <input
                  type="text"
                  value={editedProfile.nationality}
                  readOnly
                />
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
              <input
                type="text"
                name="walletBalance"
                value={profileInformation.walletBalance}
                readOnly
              />
            </p>
          </li>
        </ul>

        {/* Render the feedback message here */}
        <FeedbackMessage message={feedback.message} isSuccess={feedback.isSuccess} />

        <button onClick={handleEditClick}>
          {isEditing ? "Save" : "Update"}
        </button>
      </div>
    </div>
  );
};

export default TouristHomePage;
