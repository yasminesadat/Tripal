import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import ItineraryMainInformation from "./ItineraryMainInformation";
import OthersInformation from "../../templateComponents/OthersInformation";
import Overview from "../../templateComponents/Overview";
import LocationMap from "../../common/MapComponent";
import TourSingleSidebar from "../../templateComponents/TourSingleSidebar";
import Gallery1 from "../../templateComponents/Gallery1";
import DateCalender from "../../templateComponents/DateCalender";
import Rating from "../../templateComponents/Rating";
import ReviewBox from "../../common/reviewBox";
import ItineraryReviews from "./ItineraryReviews";
import Roadmap2 from "../../templateComponents/Roadmap2";
import TourGuideReviews from "./TourGuideReviews";
export default function ItineraryDetails({ itinerary }) {
  const location = useLocation();
  const { page } = location.state || {};
  const [markerPosition, setMarkerPosition] = useState([38.8951, -77.0364]);
  const [selectedLocation, setSelectedLocation] = useState("");

  if (!itinerary) return <div>Itinerary not found.</div>;
  const itineraryId = itinerary._id;

  return (
    <>
      <section className="">
        <div className="container">
          <ItineraryMainInformation itinerary={itinerary} />
          <Gallery1 />
        </div>
      </section>

      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <div className="row y-gap-20 justify-between items-center layout-pb-md">
                <OthersInformation language={itinerary.language} groupSize={itinerary.bookings.reduce((total, booking) => total + booking.tickets, 0)} isItinerary={"diana"} />
              </div>

              <Overview itineraryDescription={itinerary.description} serviceFee={itinerary.serviceFee} accessibility={itinerary.accessibility} />

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30 mt-60 mb-30">Road Map</h2>
              <Roadmap2 timeline={itinerary.timeline} />

              <h2 className="text-30 mt-60 mb-30">Tour Map</h2>
              <div className="mapTourSingle">
                <LocationMap
                  markerPosition={markerPosition}
                  setMarkerPosition={setMarkerPosition}
                  setSelectedLocation={setSelectedLocation}
                />
              </div>

              <div className="line mt-60 mb-60"></div>

              {/* <h2 className="text-30">Availability Calendar</h2>
              <DateCalender />

              <div className="line mt-60 mb-60"></div> */}

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