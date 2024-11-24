import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import ActivityMainInformation from "./ActivityMainInformation";
import OthersInformation from "../../templateComponents/OthersInformation";
import Overview from "../../templateComponents/Overview";
import MapComponent from "../../common/MapComponent";
import Rating from "../../templateComponents/Rating";
import TourSingleSidebar from "../../templateComponents/TourSingleSidebar";
import Gallery1 from "../../templateComponents/Gallery1";
import DateCalender from "../../templateComponents/DateCalender";
import ReviewBox from "../../common/reviewBox";
import ActivityReviews from "./ActivityReviews";
import LocationMap from "../../common/MapComponent";
// import { userRole } from "../../../IDs";
import Index from "../../templateComponents/index"
import { getUserData } from "../../../api/UserService";

export default function ActivityDetails({ activity }) {
  const location = useLocation();
  const { page } = location.state || {};
  const [markerPosition, setMarkerPosition] = useState([activity?.latitude|| 35.11, activity?.longitude||35.11]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [userRole, setUserRole] = useState(null); 
  const [userId, setUserId] = useState(null); 

  if (!activity) return <div><Index/></div>;
  const activityId = activity._id;  
  
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

  return (
    <>
      <section className="">
        <div className="container">
          <ActivityMainInformation activity={activity} />
          <Gallery1 />
        </div>
      </section>

      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <div className="row y-gap-20 justify-between items-center layout-pb-md">
              <OthersInformation groupSize={activity.bookings.reduce((total, booking) => total + booking.tickets, 0)} />
              </div>

              <Overview activityDescription={activity.description} />

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30 mt-60 mb-30">Tour Map</h2>
              <div className="mapTourSingle">
                <LocationMap 
                  markerPosition={markerPosition} 
                  setMarkerPosition={setMarkerPosition} 
                  setSelectedLocation={setSelectedLocation} 
                />
              </div>

              <div className="line mt-60 mb-60"></div>

              {page === "upcoming" && (
                <>
                  <h2 className="text-30">Availability Calendar</h2>
                  <DateCalender />
                </>
              )}

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Customer Reviews</h2>

              <div className="mt-30">
                <Rating />
              </div>

              <ActivityReviews activityId={activityId} />

              <div className="line mt-60 mb-60"></div>

              {page === "history" && (
                <ReviewBox id={activityId} type="activities" />
              )}

              <div className="line mt-60 mb-60"></div>

            </div>

            {page === "upcoming" && userRole ==='Tourist'&&(
              <div className="col-lg-4">
                <div className="d-flex justify-end js-pin-content">
                  <TourSingleSidebar activity={activity}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}