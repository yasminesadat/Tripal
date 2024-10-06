import React, { useEffect, useState } from "react";
import TouristProfile from "../../components/tourist/TouristProfile";
import { getTouristInformation } from "../../api/TouristService";
const TouristHomePage = () => {
  const [profileInformation, setProfileInformation] = useState([]);

  const getUserInformation = async () => {
    try {
      const response = await getTouristInformation("66ffa8ab139be95d178bb779");
      setProfileInformation(response);
    } catch (error) {
      console.error("Failed to fetch user information:", error);
    }
  };

  useEffect(() => {
    getUserInformation();
  }, []);

  return (
    <div>
      <h1>Your Profile</h1>
      <TouristProfile tourist={profileInformation} />
      <button>Update Profile</button>
    </div>
  );
  // <Modal
  //     title="Update Tourist Profile"
  //     open={isModalVisible}
  //     onOk={() => handleUpdate(newData)}
  //     onCancel={() => setIsModalVisible(false)}
  // >
  //     <Input
  //         value={updateCategoryName}
  //         onChange={(e) => setUpdateCategoryName(e.target.value)}
  //         placeholder="Enter new activity category name"
  //     />
  // </Modal>
};

export default TouristHomePage;
