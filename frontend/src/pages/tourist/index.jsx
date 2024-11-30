import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import PageHeader from "@/components/tours/PageHeader";
import TourList1 from "@/components/tours/TourList1";
import { useEffect, useState } from "react";
import { message } from "antd";
import { viewUpcomingActivities, getAdvertiserActivities, getAllActivities } from "@/api/ActivityService";
import AdvertiserActivities from "@/components/activity/AdvertiserActivities";
import { getAdminActivities, flagActivity } from "@/api/AdminService";
import { getUserData } from "@/api/UserService";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Tour-list-1 || ViaTour - Travel & Tour Reactjs Template",
  description: "ViaTour - Travel & Tour Reactjs Template",
};

export default function TourListPage1() {
  const [activities, setActivities] = useState([]);
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
        let response;
        if (userRole === 'Advertiser') {
          response = await getAdvertiserActivities();
        } else if (userRole === 'Tourist') {
          response = await viewUpcomingActivities();
        } else if (userRole === 'Admin') {
          response = await getAdminActivities();
        }
        else { response = await getAllActivities(); }
        const activitiesData = Array.isArray(response?.data) ? response?.data : [];
        setActivities(activitiesData);
        // setFilteredActivities(activitiesData);
      } catch (err) {
        const errorMessage = err?.response?.data?.error || err?.message || "Error fetching activities";
        // setError(errorMessage);
      } finally {
        // setLoading(false);
      }
    };
    fetchActivities();
  });

  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <Header1 />
        <PageHeader />
        <TourList1 activities={activities}/>
        <FooterOne />
      </main>
    </>
  );
}
