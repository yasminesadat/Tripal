import FooterThree from "@/components/layout/footers/FooterThree";
import Header1 from "@/components/layout/header/TouristHeader";
import TourGuideHeader from "@/components/layout/header/TourGuideHeader";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import GuestHeader from "@/components/layout/header/GuestHeader";
import PageHeader from "@/components/layout/header/ItinerariesHeader";
import  { useEffect, useState, useRef } from "react";
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
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const errorDisplayed = useRef(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {
          setUserRole(response.data.role);
        } else if (response.data.message === "No token found.") {
          setUserRole("Guest");
        } else {
          if (!errorDisplayed.current) {
            message.error(response.data.message);
            errorDisplayed.current = true;
          }
        }
      } catch (error) {
        if (!errorDisplayed.current) {
          message.error("Failed to fetch user data.");
          errorDisplayed.current = true;
        }
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
      {userRole === "Guest" && (
          <>
            <GuestHeader />
            <PageHeader onSearch={handleSearch} title="Explore all upcoming itineraries" userRole={userRole}/>
            <ActivitiesList page={"upcoming"} searchTerm={searchTerm} />
            <FooterThree />
          </>
        )}

        {userRole === "Admin" && (
          <div
            className={`dashboard ${
              sideBarOpen ? "-is-sidebar-visible" : ""
            } js-dashboard`}
          >
            <Sidebar setSideBarOpen={setSideBarOpen} />
            <div className="dashboard__content">
              <Header setSideBarOpen={setSideBarOpen} />
              <PageHeader onSearch={handleSearch} title="View all itineraries" userRole={userRole} />
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
            <PageHeader onSearch={handleSearch} title="Explore all upcoming itineraries" userRole={userRole}/>
            <ActivitiesList page={"upcoming"} searchTerm={searchTerm} />
            <FooterThree />
          </>
        )}
        {userRole === "Tour Guide" && (
          <>
            <TourGuideHeader />
            <PageHeader onSearch={handleSearch} title="View all itineraries" userRole={userRole}/>
            <ActivitiesList page={"upcoming"} searchTerm={searchTerm} />
            <FooterThree />
          </>
        )}
      </main>
    </>
  );
}
