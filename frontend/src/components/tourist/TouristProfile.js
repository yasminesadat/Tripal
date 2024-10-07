import React, { useState } from "react";
import { nationalities } from "../../assets/Nationalities";
const TouristProfile = ({ tourist }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...tourist });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditedProfile({ ...editedProfile, [name]: value });
  // };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log(editedProfile)
    }
  };

  return (
    <div>
      <ul className="tourist-profile">
        <li key={tourist._id}>
          <h2>
            <input
              type="text"
              name="userName"
              value={editedProfile.userName}
            //onChange={handleInputChange}

            />
          </h2>
          <p>
            <b>Email:</b>
            <input
              type="text"
              name="email"
              value={editedProfile.email}
              // onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </p>
          <p>
            <b>Date of birth:</b>
            <input
              type="text"
              name="dateOfBirth"
              value={new Date(tourist.dateOfBirth).toLocaleDateString()}

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
              //  onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </p>
          <p>
            <b>Mobile Number:</b>
            <input
              type="text"
              name="mobileNumber"
              value={editedProfile.mobileNumber}
              // onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </p>
          <p>
            <b>Balance:</b>
            <input
              type="text"
              name="walletBalance"
              value={editedProfile.walletBalance}

            />
          </p>
        </li>
      </ul>
      <button onClick={handleEditClick}>
        {isEditing ? "Save" : "Update"}
      </button>
    </div>
  );
};

export default TouristProfile;
