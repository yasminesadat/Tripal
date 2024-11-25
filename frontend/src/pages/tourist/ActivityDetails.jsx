import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag, message } from "antd";
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

const ActivityDetailsPage = () => {
  const { activityId } = useParams();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!activity) return <div>Activity not found.</div>;

  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        {userRole!=="Tourist" && userRole!=="Admin" && userRole!=="Advertiser" && userRole!=="TourGuide" && userRole!=="TourismGovernor" && 
          <>
            <GuestHeader /> 
            <PageHeader activityId={activityId} activityTitle={activity.title} />
            <ActivityDetails activity={activity} />
            <FooterThree />
          </>
        }

        {userRole === "Admin" && (
          <div
            className={`dashboard ${
              sideBarOpen ? "-is-sidebar-visible" : ""
            } js-dashboard`}
          >
            <Sidebar setSideBarOpen={setSideBarOpen} />
            <div className="dashboard__content">
              <Header setSideBarOpen={setSideBarOpen} />
              <PageHeader activityId={activityId} activityTitle={activity.title} />
              <ActivityDetails activity={activity} />
              <div className="text-center pt-30">
                © Copyright Tripal {new Date().getFullYear()}
              </div>
            </div>
          </div>
        )}

        {userRole === "Tourist" && (
          <>
            <Header1 />
            <PageHeader activityId={activityId} activityTitle={activity.title} tourist={'ana t3ebt'} />
            <ActivityDetails activity={activity} />
            <FooterThree />
          </>
        )}
      </main>
    </>
  );
};

export default ActivityDetailsPage;
