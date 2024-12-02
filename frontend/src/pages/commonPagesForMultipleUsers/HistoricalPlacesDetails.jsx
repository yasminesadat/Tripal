import FooterThree from "@/components/layout/footers/FooterThree";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import GuestHeader from "@/components/layout/header/GuestHeader";
import GovernorHeader from "@/components/layout/header/GovernorHeader";
import PageHeader from "@/components/layout/header/HistoricalPlacesHeader";
import  { useEffect, useState, useRef } from "react";
import { message } from "antd";
import { getUserData } from "@/api/UserService";
import MetaComponent from "@/components/common/MetaComponent";
import HistoricalPlaceDetails from "../historicalPlace/HistoricalPlaceDetails";
import TouristHeader from "@/components/layout/header/TouristHeader";
const metadata = {
  title: "HistoricalPlaces || Tripal",
  description: "HistoricalPlaces || Tripal",
};

export default function HistoricalPlacesDetails() {
  const [userRole, setUserRole] = useState(null); 
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
           
            <HistoricalPlaceDetails  />
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
            
              <HistoricalPlaceDetails />
              <div className="text-center pt-30">
                © Copyright Tripal {new Date().getFullYear()}
              </div>
            </div>
          </div>
        )}
         {userRole === "Tourist" && (
          <>
            <TouristHeader />
           
            <HistoricalPlaceDetails  />
            <FooterThree />
          </>
        )}
        {userRole === "Tourism Governor" && (
          <>
            <GovernorHeader />
           
            <HistoricalPlaceDetails  />
            <FooterThree />
          </>
        )}
      </main>
    </>
  );
}