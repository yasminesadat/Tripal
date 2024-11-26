import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/TouristHeader";
import PageHeader from "@/components/layout/header/ActivitiesHeader";

import React, { useEffect, useState } from "react";

import ActivitiesList from  "@/components/activity/UpcomingActivities"
import { message } from "antd";
import { getUserData } from "@/api/UserService";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Itineraries || Tripal",
  description: "Itineraries || Tripal",
};

export default function Activities() {
  const [userRole, setUserRole] = useState(null); 
  const [userId, setUserId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {
          setUserRole(response.data.role);
          setUserId(response.data.id);
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term); 
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <Header1 />
        <PageHeader onSearch={handleSearch} />
        <ActivitiesList page={"upcoming"} searchTerm={searchTerm} />
        <FooterOne />
      </main>
    </>
  );
}
