import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { message, Tour } from "antd";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { itineraryId } = useParams();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const refItineraryBook = useRef(null);
  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "Book Itinerary",
      description: "Another step towards a great time.",
      target: () => refItineraryBook.current,
      onFinish: () => {
        setOpen(false); 
        localStorage.setItem('currentStep', 5); 
        navigate("/tourist", { state: { fromTour: true, targetStep: 5 } });
      },
    },
  ]

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

  useEffect(() => {
    const isFromTour = location.state?.fromTour;

    if ( isFromTour && refItineraryBook.current) {
      refItineraryBook.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
            <GuestHeader /> 
            <PageHeader itineraryId={itineraryId} itineraryTitle={itinerary.title} />
            <ItineraryDetails 
              itinerary={itinerary} 
              userRole={userRole} 
              refItineraryBook={refItineraryBook} 
            />
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
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
            <Header1 />
            <PageHeader itineraryId={itineraryId} itineraryTitle={itinerary.title}  userRole={userRole}/>
            <ItineraryDetails 
              itinerary={itinerary} 
              userRole={userRole}
              refItineraryBook={refItineraryBook} 
            />
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