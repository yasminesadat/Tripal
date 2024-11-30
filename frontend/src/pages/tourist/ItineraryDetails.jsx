import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";
import FooterThree from "@/components/layout/footers/FooterThree";
import Header1 from "@/components/layout/header/TouristHeader";
import PageHeader from "@/components/layout/header/SingleItineraryHeader";
import TourGuideHeader from "@/components/layout/header/TourGuideHeader";
import GuestHeader from "@/components/layout/header/GuestHeader";
import { getItineraryById } from "@/api/ItineraryService";
import ItineraryDetails from "@/components/itinerary/itinerarySingle/ItineraryDetails";
import { getUserData } from "@/api/UserService";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import MetaComponent from "@/components/common/MetaComponent";
import NotFoundPage from "@/pages/pages/404";
import Spinner from "@/components/common/Spinner";
import Index from './index'

const ItineraryDetailsPage = () => {
  //#region 1. Variables
  const { itineraryId } = useParams();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  //const [userId, setUserId] = useState(null);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  //#endregion

  //#region 2. useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {
          setUserRole(response.data.role);
          //setUserId(response.data.id);
        } else {
          message.error(response.data.message);
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
        const response = await getItineraryById(itineraryId);
        setItinerary(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching activities");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);
  //#endregion
  
  if (loading) return <div><Spinner/></div>;
  if (error) return <div><NotFoundPage/></div>;
  if (!itinerary) return <div><Index/></div>;

  const metadata = {
    title: `${itinerary.title} Details | Tripal Travel`,
    description: "Itinerary Details || Tripal Travel",
  };
  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        {userRole === "Guest" && 
          <>
            <GuestHeader /> 
            <PageHeader itineraryId={itineraryId} itineraryTitle={itinerary.title} />
            <ItineraryDetails itinerary={itinerary} userRole={userRole} />
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
              <PageHeader itineraryId={itineraryId} itineraryTitle={itinerary.title} userRole={userRole} />
              <ItineraryDetails itinerary={itinerary} userRole={userRole} />
              <div className="text-center pt-30">
                © Copyright Tripal {new Date().getFullYear()}
              </div>
            </div>
          </div>
        )}

        {userRole === "Tourist" && (
          <>
            <Header1 />
            <PageHeader itineraryId={itineraryId} itineraryTitle={itinerary.title}  userRole={userRole}/>
            <ItineraryDetails itinerary={itinerary} userRole={userRole}/>
            <FooterThree />
          </>
        )}

        {userRole === "Tour Guide" && (
          <>
            <TourGuideHeader />
            <PageHeader itineraryId={itineraryId} itineraryTitle={itinerary.title}  userRole={userRole}/>
            <ItineraryDetails itinerary={itinerary} userRole={userRole} />
            <FooterThree />
          </>
        )}
      </main>
    </>
  );
};

export default ItineraryDetailsPage;