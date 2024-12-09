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
      title: "Check More Details",
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
      <style jsx global>{`
        /* Base style for all dots */
        /* Try multiple selectors and approaches */
        .ant-tour .ant-tour-indicators > span {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #dac4d0 !important;
        }
        .ant-tour .ant-tour-indicators > span[class*="active"] {
          background: #036264 !important;
        }

        /* Additional specificity */
        .ant-tour-indicators span[role="dot"][aria-current="true"] {
          background: #036264 !important;
        }

        .ant-tour .ant-tour-inner {
          border: 1px solid #5a9ea0;
          box-shadow: 0 4px 12px rgba(3, 98, 100, 0.15);
        }

        .ant-tour .ant-tour-content {
          color: #8f5774;
          font-weight: 500 !important;
          letter-spacing: 0.3px !important;
          text-rendering: optimizeLegibility !important;
        }

        .ant-tour .ant-tour-title {
          color: #5a9ea0;
          font-weight: 600;
        }

        .ant-tour .ant-tour-close {
          color: #5a9ea0;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .ant-tour .ant-tour-close:hover {
          opacity: 1;
          color: #e5f8f8;
        }

        .ant-tour .ant-tour-buttons .ant-btn {
          transition: all 0.3s ease;
        }

        .ant-tour .ant-tour-buttons .ant-btn-primary
        {
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        .ant-tour .ant-tour-buttons .ant-btn-default{
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        
        .ant-tour .ant-tour-buttons .ant-btn-primary:hover,
        .ant-tour .ant-tour-buttons .ant-btn-default:hover {
          color:white;
          background: #5a9ea0;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(3, 98, 100, 0.2);
        }
        .ant-tour .ant-tour-arrow-content {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }  
      `}</style>
      <main>
        {userRole === "Guest" && (
          <>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
            <GuestHeader />
            <PageHeader
              onSearch={handleSearch}
              title="Explore all upcoming activities"
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
              <PageHeader onSearch={handleSearch} title="View all activities" admin={"walahy admin"}/>
              <ActivitiesList 
                page={"upcoming"} 
                searchTerm={searchTerm} 
                refActivityDetails={refActivityDetails} 
                onFirstActivityId={handleFirstActivityId}
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
              tourist={"ana tourist"}
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