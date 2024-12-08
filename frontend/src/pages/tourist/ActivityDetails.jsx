import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { message, Tour } from "antd";
import FooterThree from "@/components/layout/footers/FooterThree";
import Header1 from "@/components/layout/header/TouristHeader";
import PageHeader from "@/components/layout/header/SingleActivityHeader";
import { getActivityById } from "@/api/ActivityService";
import ActivityDetails from "@/components/activity/activitySingle/ActivityDetails";
import { getUserData } from "@/api/UserService";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import MetaComponent from "@/components/common/MetaComponent";
import GuestHeader from "@/components/layout/header/GuestHeader";

const metadata = {
  title: "Activity Details || Tripal",
  description: "Activity Details || Tripal",
};
import NotFoundPage from "@/pages/pages/404";

const ActivityDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activityId } = useParams();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");  // For currency state
  const refActivityBook = useRef(null);
  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "Book Activity",
      description: "Cross it off your bucket-list.",
      target: () => refActivityBook.current,
      onFinish: () => {
        setOpen(false); 
        localStorage.setItem('currentStep', 4); 
        navigate("/tourist", { state: { fromTour: true, targetStep: 4 } });
      },
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
        }
      } catch (error) {
        message.error("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivityById(activityId);
        setActivity(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching activities");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [activityId]);

  useEffect(() => {
    const isFromTour = location.state?.fromTour;

    if ( isFromTour && refActivityBook.current) {
      refActivityBook.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  useEffect(() => {
    const isFromTour = location.state?.fromTour;
  
    const timer = setTimeout(() => {
      if (isFromTour) {
        setOpen(true); 
      }
    }, 1200); 
  
    return () => clearTimeout(timer); 
  }, [location]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        <NotFoundPage />
      </div>
    );
  if (!activity) return <div>Activity not found.</div>;

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
              activityId={activityId}
              activityTitle={activity.title}
            />
            <ActivityDetails
              activity={activity}
              selectedCurrency={selectedCurrency}  // Pass selectedCurrency
              userRole={userRole}
              refActivityBook={refActivityBook}
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
              <PageHeader
                activityId={activityId}
                activityTitle={activity.title}
                admin={"ana admin"}
              />
              <ActivityDetails
                activity={activity}
                selectedCurrency={selectedCurrency}  // Pass selectedCurrency
                userRole={userRole}
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
            <Header1 />
            <PageHeader
              activityId={activityId}
              activityTitle={activity.title}
              tourist={"ana t3ebt"}
            />
            <ActivityDetails
              activity={activity}
              selectedCurrency={selectedCurrency} 
            
              userRole={userRole}
              refActivityBook={refActivityBook}
            />
            <FooterThree />
          </>
        )}
      </main>
    </>
  );
};

export default ActivityDetailsPage;
