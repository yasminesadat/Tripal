import React from "react";

const TouristProfile = ({ tourist }) => {
  return (
    <ul>
      <li key={tourist._id}>
        <h2>{tourist.userName}</h2>
        <p>Email: {tourist.email}</p>
        <p>
          Date of birth: {new Date(tourist.dateOfBirth).toLocaleDateString()}
        </p>
        <p>Nationality: {tourist.nationality}</p>
        <p>Job: {tourist.job}</p>
        <p>Mobile Number: {tourist.mobileNumber}</p>
      </li>
    </ul>
  );
};

export default TouristProfile;
