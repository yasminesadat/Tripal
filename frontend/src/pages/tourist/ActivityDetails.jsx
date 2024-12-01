import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Tag, message, Tour } from "antd";
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
  const [userId, setUserId] = useState(null);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const refActivityBook = useRef(null);
  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "Book Activity.",
      description: "Another step towards a great time.",
      target: () => refActivityBook.current,
      onFinish: () => {
        localStorage.setItem('currentStep', 4); 
        navigate("/tourist", { state: { fromActivityDetails: true, targetStep: 4 } });
      },
    },
  ]

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {
          setUserRole(response.data.role);
          setUserId(response.data.id);
        } else if (response.data.message === "No token found.") {
          setUserRole("Guest");
        } else {
          message.error(response.data.message);
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
    }, 1000); //might need to change it
  
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
      <main>
        {userRole === "Guest" && (
          <>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
            <GuestHeader />
            <PageHeader
              activityId={activityId}
              activityTitle={activity.title}
            />
            <ActivityDetails activity={activity} refActivityBook={refActivityBook}/>
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
              <PageHeader
                activityId={activityId}
                activityTitle={activity.title}
              />
              <ActivityDetails activity={activity} />
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
            <ActivityDetails activity={activity} refActivityBook={refActivityBook}/>
            <FooterThree />
          </>
        )}
      </main>
    </>
  );
};

export default ActivityDetailsPage;
