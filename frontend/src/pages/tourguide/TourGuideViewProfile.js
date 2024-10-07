
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createTourGuide, updateProfile, getProfileData } from "../../api/TourGuideService";
const TourGuideProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("hh");
      try {
        const response = await getProfileData(id);
        if (!response) {
          throw new Error('TourGuide not found');
        }
        const data = await response.data;
        setUser(data);
        console.log("respnpse" + data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>Username:</strong> {user.userName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Mobile Number:</strong> {user.mobileNumber || 'Not provided'}</p>
      <p><strong>Experience (Years):</strong> {user.experienceYears}</p>
    </div>
  );
};

export default TourGuideProfile;
