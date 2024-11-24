import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ActivityMainInformation from "./ActivityMainInformation";
import OthersInformation from "./OthersInformation";
import Overview from "./Overview";
import MapComponent from "../../common/MapComponent";
import TourSingleSidebar from "./TourSingleSidebar";
import Gallery1 from "./Gallery1";
import DateCalender from "./DateCalender";
import ReviewBox from "../../common/ReviewBox";
import ActivityReviews from "./ActivityReviews";
import LocationMap from "../../common/MapComponent";
import { Tag, message } from "antd";

import { getUserData } from "@/api/UserService";

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

              {/* <div className="line mt-60 mb-60"></div> */}

              {/* {page === "upcoming" && (
                <>
                  <h2 className="text-30">Availability Calendar</h2>
                  <DateCalender />
                </>
              )} */}

              <h2 className="text-30">Customer Reviews</h2>

              <ActivityReviews activityId={activityId} />

              {page === "history" && (
                <div>
                  <div className="line mt-60 mb-60"></div>
                  <ReviewBox id={activityId} type="activities" />
                </div>
              )}

              <div className="line mt-60 mb-60"></div>

            </div>

            {page === "upcoming" && userRole ==='Tourist' &&(
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