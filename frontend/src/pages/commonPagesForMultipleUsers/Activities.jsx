import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tour, message } from "antd";
import { getUserData } from "@/api/UserService";
import MetaComponent from "@/components/common/MetaComponent";
import FooterThree from "@/components/layout/footers/FooterThree";
import Header from "@/components/dasboard/Header";
import GuestHeader from "@/components/layout/header/GuestHeader";
import TouristHeader from "@/components/layout/header/TouristHeader";
import PageHeader from "@/components/layout/header/ActivitiesHeader";
import ActivitiesList from "@/components/activity/UpcomingActivities";
import Sidebar from "@/components/dasboard/Sidebar";

const metadata = {
  title: "Activities || Tripal",
  description: "Activities || Tripal",
};

export default function Activities() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const errorDisplayed = useRef(false);
  const refActivityDetails = useRef(null);
  const [open, setOpen] = useState(false);
  const [firstActivityId, setFirstActivityId] = useState(null);  

  const steps = [
    {
      title: "Check More Details.",
      description: "Helps you in making a final decision.",
      target: () => refActivityDetails.current, 
      onNext: () => {
        if (firstActivityId) 
          navigate(`/activity/${firstActivityId}`, { state: { fromTour: true, page: "upcoming" } })
      }
    },
    {
      title: "Nothing",
      description: "Helps you in making a final decision.",
      target: () => refActivityDetails.current, 
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

  const handleFirstActivityId = (id) => {
    setFirstActivityId(id); 
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
            <PageHeader
              onSearch={handleSearch}
              title="Explore all upcoming activities"
              tourist={true}
            />
            <ActivitiesList 
              page={"upcoming"} 
              searchTerm={searchTerm} 
              refActivityDetails={refActivityDetails} 
              onFirstActivityId={handleFirstActivityId}
            />
            <FooterThree />
          </>
        )}

        {userRole === "Admin" && (
          <div
            className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}
          >
            <Sidebar setSideBarOpen={setSideBarOpen} />
            <div className="dashboard__content">
              <Header setSideBarOpen={setSideBarOpen} />
              <PageHeader onSearch={handleSearch} title="View all activities" />
              <ActivitiesList 
                page={"upcoming"} 
                searchTerm={searchTerm} 
              />
              <div className="text-center pt-30">
                © Copyright Tripal {new Date().getFullYear()}
              </div>
            </div>
          </div>
        )}

        {userRole === "Tourist" && (
          <>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
            <TouristHeader/>
            <PageHeader
              onSearch={handleSearch}
              title="Explore all upcoming activities"
              tourist={true}
            />
            <ActivitiesList 
              page={"upcoming"} 
              searchTerm={searchTerm} 
              refActivityDetails={refActivityDetails}
              onFirstActivityId={handleFirstActivityId}
            />
            <FooterThree />
          </>
        )}
      </main>
    </>
  );
}