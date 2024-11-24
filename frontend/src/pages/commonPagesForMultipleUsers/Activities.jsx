import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/TouristHeader";
import PageHeader from "@/components/layout/header/ActivitiesHeader";

import React, { useEffect, useState } from "react";

import ActivitiesList from  "@/components/activity/UpcomingActivities"
import { message } from "antd";
import { getUserData } from "@/api/UserService";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Tour-list-1 || ViaTour - Travel & Tour Reactjs Template",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function Activities() {
  const [userRole, setUserRole] = useState(null); 
  const [userId, setUserId] = useState(null); 

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

  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <Header1 />
        <PageHeader />
        <ActivitiesList page={"upcoming"} />
        <FooterOne />
      </main>
    </>
  );
}
