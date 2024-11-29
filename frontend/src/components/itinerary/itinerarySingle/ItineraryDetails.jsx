import { useLocation } from "react-router-dom";
import ItineraryMainInformation from "./ItineraryMainInformation";
import OthersInformation from "@/components/activity/activitySingle/OthersInformation";
import Overview from "@/components/activity/activitySingle/Overview";
import LocationMap from "../../common/MapComponent";
import TourSingleSidebar from "@/components/activity/activitySingle/TourSingleSidebar";
import Gallery1 from "@/components/activity/activitySingle/Gallery1";
import Rating from "./Rating";
import ReviewBox from "../../common/reviewBox";
import ItineraryReviews from "./ItineraryReviews";
import Roadmap2 from "./Roadmap2";
import TourGuideReviews from "./TourGuideReviews";
import Index from './Index'

export default function ItineraryDetails({ itinerary, userRole }) {
  
  //#region 1. Variables
  const location = useLocation();
  const { page } = location.state || {};
  const markerPosition = [itinerary.location?.latitude|| 35.11, itinerary.location?.longitude||35.11];
  const startDate = new Date(itinerary.startDate);
  const endDate = new Date(itinerary.endDate);
  const durationInMilliseconds = endDate - startDate;
  const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24); // Convert milliseconds to days
  //#endregion

  if (!itinerary) return <div><Index/></div>;
  const itineraryId = itinerary._id;

  return (
    <>
      <section className="">
        <div className="container">
          <ItineraryMainInformation itinerary={itinerary} userRole={userRole} />
          <Gallery1 />
        </div>
      </section>
      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <div className="row y-gap-20 justify-between items-center layout-pb-md">
                <OthersInformation duration={durationInDays} language={itinerary.language} groupSize={itinerary.bookings.reduce((total, booking) => total + booking.tickets, 0)} isItinerary={"diana"} />
              </div>

              <Overview itineraryDescription={itinerary.description} serviceFee={itinerary.serviceFee} accessibility={itinerary.accessibility} />

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30 mt-60 mb-30">Road Map</h2>
              <Roadmap2 timeline={itinerary.timeline} />

              <h2 className="text-30 mt-60 mb-30">Tour Map</h2>
              <div className="mapTourSingle">
                <LocationMap
                  markerPosition={markerPosition}
                  search={"dont search bro"}
                 
                />
              </div>

              <div className="line mt-60 mb-60"></div>
              <h2 className="text-30">Customer Reviews</h2>

              <div className="mt-30">
                <Rating />
              </div>
              <br></br>
              <h2>Itinerary Comments & Ratings </h2>
              {page === "history" && <ItineraryReviews itineraryId={itineraryId} />}
              <br></br>
              <h2>Tour Guide Comments & Ratings </h2>
              <br></br>
              {page === "history" && <TourGuideReviews id={itinerary.tourGuide} />}
              {/* <button className="button -md -outline-accent-1 text-accent-1 mt-30">
                See more reviews
                <i className="icon-arrow-top-right text-16 ml-10"></i>
              </button> */}
              <div className="line mt-60 mb-60"></div>
              {page === "history" && (
                <><ReviewBox id={itineraryId} type="itinerary" /><div className="line mt-60 mb-60"></div><ReviewBox id={itinerary.tourGuide} type="tourGuide" /></>
              )}
            </div>

            <div className="col-lg-4">
              <div className="d-flex justify-end js-pin-content">
                {page == "upcoming" && userRole === 'Tourist' && <TourSingleSidebar itinerary={itinerary} />}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}