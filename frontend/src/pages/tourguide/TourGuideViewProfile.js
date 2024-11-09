import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateProfile, getProfileData } from "../../api/TourGuideService";
import '../seller/SellerProfile.css';
import TourguideNavBar from "../../components/navbar/TourguideNavBar";
import ChangePassword from "../../components/common/ChangePassword";
import { requestAccountDeletion } from "../../api/RequestService";
import { message } from 'antd';
import { tourGuideID } from '../../IDs';

const TourGuideProfile = () => {
  const id = tourGuideID;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getProfileData(id);
        if (!response) {
          throw new Error("TourGuide not found");
        }
        const data = await response.data;
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDeletion = async () => {
    try {
      const response = await requestAccountDeletion("Tourguide", id);
      message.success(response.message);
    } catch (error) {
      message.warning(error.response?.data?.message || "An error occurred");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <TourguideNavBar />

      <div className="seller-profile-container">
        <h1 className="profile-title">User Profile</h1>
        <div className="profile-info">
          <p>
            <strong>Username:</strong> {user.userName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Mobile Number:</strong>{" "}
            {user.mobileNumber || "Not provided"}
          </p>
          <p>
            <strong>Experience (Years):</strong> {user.yearsOfExperience}
          </p>
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              style={{ maxHeight: "100px" }}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <ChangePassword id={tourGuideID} userType="tour guide" />
      <button onClick={handleDeletion}>Delete Account</button>

    </div>
  );
};

export default TourGuideProfile;
