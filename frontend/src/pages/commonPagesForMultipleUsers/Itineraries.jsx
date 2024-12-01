import  { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tour, message } from "antd";
import FooterThree from "@/components/layout/footers/FooterThree";
import Header1 from "@/components/layout/header/TouristHeader";
import TourGuideHeader from "@/components/layout/header/TourGuideHeader";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import GuestHeader from "@/components/layout/header/GuestHeader";
import PageHeader from "@/components/layout/header/ItinerariesHeader";
import ItinerariesList from "@/components/itinerary/UpcomingItinerariesList";
import { getUserData } from "@/api/UserService";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Itineraries || Tripal",
  description: "Itineraries || Tripal",
};

export default function Itineraries() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); 
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const errorDisplayed = useRef(false);
  const refItineraryDetails = useRef(null);
  const [open, setOpen] = useState(false);
  const [firstItineraryId, setFirstItineraryId] = useState(null);  

  const steps = [
    {
      title: "Check More Details.",
      description: "Get to know more about the itinerary.",
      target: () => refItineraryDetails.current, 
      onNext: () => {
        if (firstItineraryId) 
          navigate(`/itinerary/${firstItineraryId}`, { state: { fromTour: true, page: "upcoming" } })
      }
    },
    {
      title: "Nothing",
      description: "Helps you in making a final decision.",
      target: () => refItineraryDetails.current, 
    },
  ]
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

  const handleFirstItineraryId = (id) => {
    setFirstItineraryId(id); 
  };

  useEffect(() => {
    const isFromTour = location.state?.fromTour;
  
    const timer = setTimeout(() => {
      if (isFromTour) {
        setOpen(true); 
      }
    }, 300); 
  
    return () => clearTimeout(timer); 
  }, [location]);

  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
      {userRole === "Guest" && (
          <>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
            <GuestHeader />
            <PageHeader onSearch={handleSearch} title="Explore all upcoming itineraries" userRole={userRole}/>
            <ItinerariesList 
              page={"upcoming"} 
              searchTerm={searchTerm} 
              refItineraryDetails={refItineraryDetails}
              onFirstItineraryId={handleFirstItineraryId}
            />
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
              <ItinerariesList page={"upcoming"} searchTerm={searchTerm} />
              <div className="text-center pt-30">
                © Copyright Tripal {new Date().getFullYear()}
              </div>
            </div>
          </div>
        )}
        
        {userRole === "Tourist" && (
          <>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
            <Header1 />
            <PageHeader onSearch={handleSearch} title="Explore all upcoming itineraries" userRole={userRole}/>
            <ItinerariesList 
              page={"upcoming"} 
              searchTerm={searchTerm} 
              refItineraryDetails={refItineraryDetails}
              onFirstItineraryId={handleFirstItineraryId}
            />
            <FooterThree />
          </>
        )}

        {userRole === "Tour Guide" && (
          <>
            <TourGuideHeader />
            <PageHeader onSearch={handleSearch} title="Manage My Itineraries" userRole={userRole}/>
            <ItinerariesList page={"upcoming"} searchTerm={searchTerm} />
            <FooterThree />
          </>
        )}
      </main>
    </>
  );
}