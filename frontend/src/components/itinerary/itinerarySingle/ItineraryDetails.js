import { useLocation } from "react-router-dom";
import ItineraryMainInformation from "./ItineraryMainInformation";
// import OthersInformation from "./OthersInformation";
// import Overview from "./Overview";
import MapComponent from "../../common/MapComponent";
// import Rating from "./Rating";
// import TourSingleSidebar from "./TourSingleSidebar";
// import Gallery1 from "./Gallery1";
// import DateCalender from "./DateCalender";
import ReviewBox from "../../common/reviewBox";
import ItineraryReviews from "./ItineraryReviews";

export default function ItineraryDetails({ itinerary }) {
  const location = useLocation();
  const { page } = location.state || {};

  if (!itinerary) return <div>Itinerary not found.</div>;
  const itineraryId = itinerary._id;

  return (
    <>
      <section className="">
        <div className="container">
          <ItineraryMainInformation itinerary={itinerary} />
          {/* <Gallery1 /> */}
        </div>
      </section>

      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <div className="row y-gap-20 justify-between items-center layout-pb-md">
                {/* <OthersInformation /> */}
              </div>

              {/* <Overview /> */}

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30 mt-60 mb-30">Road Map</h2>
              {/* <Roadmap2 />   */}

              <h2 className="text-30 mt-60 mb-30">Tour Map</h2>
              <div className="mapTourSingle">
                <MapComponent />
              </div>

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Availability Calendar</h2>
              {/* <DateCalender /> */}

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Customer Reviews</h2>

              <div className="mt-30">
                {/* <Rating /> */}
              </div>

              <ItineraryReviews itineraryId={itineraryId} />

              {/* <button className="button -md -outline-accent-1 text-accent-1 mt-30">
                See more reviews
                <i className="icon-arrow-top-right text-16 ml-10"></i>
              </button> */}

              <div className="line mt-60 mb-60"></div>
              
              {page === "history" && (
                <ReviewBox id={itineraryId} type="itinerary" />
              )}
            </div>

            <div className="col-lg-4">
              <div className="d-flex justify-end js-pin-content">
                {/* <TourSingleSidebar /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
