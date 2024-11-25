import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Tag, message } from "antd";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/TouristHeader";
import PageHeader from "@/components/layout/header/SingleActivityHeader";
import {  getAllActivities } from "@/api/ActivityService";
import ActivityDetails from "../../components/activity/activitySingle/ActivityDetails";
import { getUserData } from "@/api/UserService";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Activity Details || Tripal",
  description: "Activity Details || Tripal",
};

const ActivityDetailsPage = () => {
    const { activityId } = useParams();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await getAllActivities();
                setActivities(response.data);
            } catch (err) {
                setError(err.response?.data?.error || "Error fetching activities");
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const activity = activities?.find(activity => activity._id === activityId);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!activity) return <div>Activity not found.</div>;

    return (
        <div>
          <MetaComponent meta={metadata} />

          {userRole === "Tourist" && (
            <>
              <Header1 />
            </>
          )}
          {/* another header for guest */}          
          <PageHeader activityId={activityId} activityTitle={activity.title} />
          <ActivityDetails activity={activity} />
          <FooterOne />
        </div>
    );
};

export default ActivityDetailsPage;