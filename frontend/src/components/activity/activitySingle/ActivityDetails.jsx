import { useLocation } from "react-router-dom";
import ActivityMainInformation from "./ActivityMainInformation";
import OthersInformation from "./OthersInformation";
import Overview from "./Overview";
import TourSingleSidebar from "./TourSingleSidebar";
import Gallery1 from "./Gallery1";
import ReviewBox from "../../common/ReviewBox";
import ActivityReviews from "./ActivityReviews";
import LocationMap from "../../common/MapComponent";
import NotFoundPage from "@/components/itinerary/itinerarySingle/Index";

export default function ActivityDetails({ activity, userRole, refActivityBook }) {

  //#region 1. Variables
  const location = useLocation();
  const { page } = location.state || {};
  const markerPosition = [activity?.latitude|| 35.11, activity?.longitude||35.11];
  const activityId = activity._id;  
  //#endregion

  if (!activity) return <div><NotFoundPage/></div>;

  return (
    <>
      <section className="" >
        <div className="container">

          <ActivityMainInformation activity={activity} userRole ={userRole}/>
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
                  search={"dont search bro"}
                />

              </div>
              
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
            {page === "upcoming" && userRole === 'Tourist' && (
              <div className="col-lg-4">
                <div className="d-flex justify-end js-pin-content">
                  <TourSingleSidebar activity={activity} refActivityBook={refActivityBook}/>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}