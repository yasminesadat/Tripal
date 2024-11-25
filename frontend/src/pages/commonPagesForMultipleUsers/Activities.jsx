import FooterThree from "@/components/layout/footers/FooterThree";
import Header1 from "@/components/layout/header/TouristHeader";
import PageHeader from "@/components/layout/header/ActivitiesHeader";

import React, { useEffect, useState } from "react";

import ActivitiesList from "@/components/activity/UpcomingActivities";
import { message } from "antd";
import { getUserData } from "@/api/UserService";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Activities || Tripal - Travel Agency",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function Activities() {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(true);

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
        {userRole === "Admin" && (
          <div
            className={`dashboard ${
              sideBarOpen ? "-is-sidebar-visible" : ""
            } js-dashboard`}
          >
            <Sidebar setSideBarOpen={setSideBarOpen} />
            <div className="dashboard__content">
              <Header setSideBarOpen={setSideBarOpen} />
              <PageHeader
                onSearch={handleSearch}
                title="View all activities"
              />
              <ActivitiesList page={"upcoming"} searchTerm={searchTerm} />
              <div className="text-center pt-30">
                © Copyright Tripal {new Date().getFullYear()}
              </div>
            </div>
          </div>
        )}

        {userRole === "Tourist" && (
          <>
            <Header1 />
            <PageHeader
              onSearch={handleSearch}
              title="Explore all upcoming activities"
            />
            <ActivitiesList page={"upcoming"} searchTerm={searchTerm} />
            <FooterThree />
          </>
        )}
      </main>
    </>
  );
}
