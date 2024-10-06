import React from "react";

const TouristProfile = ({ tourist }) => {
  return (
    <ul className="tourist-profile">
      <li key={tourist._id}>
        <h2>{tourist.userName}</h2>
        <p><b>Email:</b> {tourist.email}</p>
        <p><b>Date of birth:</b> {new Date(tourist.dateOfBirth).toLocaleDateString()}</p>
        <p><b>Nationality:</b>{tourist.nationality}</p>
        <p><b>Job: </b>{tourist.job}</p>
        <p><b>Mobile Number: </b>{tourist.mobileNumber}</p>
      </li >
    </ul >
  );
};

export default TouristProfile;
